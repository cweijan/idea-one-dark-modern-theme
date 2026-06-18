package github.cweijan.materialicons.toolwindow

import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.project.Project
import com.intellij.openapi.util.IconLoader
import com.intellij.openapi.wm.ToolWindowEP
import com.intellij.openapi.wm.ToolWindowManager
import java.util.concurrent.atomic.AtomicBoolean

internal object ColorToolWindowIconPatcherInstaller {
    private val installed = AtomicBoolean(false)

    fun ensureInstalled() {
        if (!installed.compareAndSet(false, true)) {
            return
        }
        IconLoader.installPathPatcher(ColorToolWindowIconsPatcher)
        IconLoader.clearCache()
        ColorToolWindowLafListener.register()
    }

    fun refreshToolWindowIcons(project: Project) {
        if (project.isDisposed) {
            return
        }
        ApplicationManager.getApplication().invokeLater {
            if (project.isDisposed) {
                return@invokeLater
            }
            val manager = ToolWindowManager.getInstance(project)
            for (bean in ToolWindowEP.EP_NAME.extensionList) {
                val toolWindow = manager.getToolWindow(bean.id) ?: continue
                val iconPath = bean.icon ?: continue
                val icon = IconLoader.findIcon(iconPath, bean.pluginDescriptor.classLoader) ?: continue
                toolWindow.setIcon(icon)
            }
        }
    }
}
