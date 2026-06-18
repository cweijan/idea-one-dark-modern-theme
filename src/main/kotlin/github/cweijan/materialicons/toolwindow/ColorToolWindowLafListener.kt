package github.cweijan.materialicons.toolwindow

import com.intellij.ide.ui.LafManager
import com.intellij.ide.ui.LafManagerListener
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.project.ProjectManager
import com.intellij.openapi.util.IconLoader

internal class ColorToolWindowLafListener : LafManagerListener {
    override fun lookAndFeelChanged(source: LafManager) {
        ColorToolWindowIconsPatcher.clearCache()
        IconLoader.clearCache()
        for (project in ProjectManager.getInstance().openProjects) {
            ColorToolWindowIconPatcherInstaller.refreshToolWindowIcons(project)
        }
    }

    companion object {
        fun register() {
            ApplicationManager.getApplication().messageBus.connect()
                .subscribe(LafManagerListener.TOPIC, ColorToolWindowLafListener())
        }
    }
}
