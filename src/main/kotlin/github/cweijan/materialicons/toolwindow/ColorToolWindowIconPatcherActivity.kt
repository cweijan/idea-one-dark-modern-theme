package github.cweijan.materialicons.toolwindow

import com.intellij.openapi.project.Project
import com.intellij.openapi.startup.ProjectActivity

internal class ColorToolWindowIconPatcherActivity : ProjectActivity {
    override suspend fun execute(project: Project) {
        ColorToolWindowIconPatcherInstaller.ensureInstalled()
        ColorToolWindowIconPatcherInstaller.refreshToolWindowIcons(project)
    }
}
