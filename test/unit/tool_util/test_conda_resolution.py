import os
import shutil
import unittest
from tempfile import mkdtemp

from galaxy.tool_util.deps import (
    conda_util,
    DependencyManager
)
from galaxy.tool_util.deps.requirements import ToolRequirement
from galaxy.tool_util.deps.resolvers.conda import CondaDependencyResolver


def skip_unless_environ(var):
    if var in os.environ:
        return lambda func: func
    template = "Environment variable %s not found, dependent test skipped."
    return unittest.skip(template % var)


external_dependency_management = skip_unless_environ("GALAXY_TEST_INCLUDE_SLOW")


@external_dependency_management
def test_conda_resolution():
    base_path = mkdtemp()
    try:
        job_dir = os.path.join(base_path, "000")
        dependency_manager = DependencyManager(base_path)
        resolver = CondaDependencyResolver(
            dependency_manager,
            auto_init=True,
            auto_install=True,
            use_path_exec=False,  # For the test ensure this is always a clean install
        )
        req = ToolRequirement(name="samtools", version=None, type="package")
        dependency = resolver.resolve(req, job_directory=job_dir)
        assert dependency.shell_commands() is not None
    finally:
        shutil.rmtree(base_path)


@skip_unless_environ("GALAXY_TEST_INCLUDE_SLOW")
def test_against_conda_prefix_regression():
    """Test that would fail if https://github.com/rtfd/readthedocs.org/issues/1902 regressed."""

    base_path = mkdtemp(prefix='x' * 80)  # a ridiculously long prefix
    try:
        job_dir = os.path.join(base_path, "000")
        dependency_manager = DependencyManager(base_path)
        resolver = CondaDependencyResolver(
            dependency_manager,
            auto_init=True,
            auto_install=True,
            use_path_exec=False,  # For the test ensure this is always a clean install
        )
        conda_context = resolver.conda_context
        assert len(list(conda_util.installed_conda_targets(conda_context))) == 0
        req = ToolRequirement(name="samtools", version="0.1.16", type="package")
        dependency = resolver.resolve(req, job_directory=job_dir)
        assert dependency.shell_commands() is not None  # install should not fail anymore
        installed_targets = list(conda_util.installed_conda_targets(conda_context))
        assert len(installed_targets) > 0
    finally:
        shutil.rmtree(base_path)
