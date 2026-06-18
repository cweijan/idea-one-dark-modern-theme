package github.cweijan.materialicons.toolwindow

import com.intellij.openapi.project.Project
import com.intellij.openapi.startup.ProjectActivity
import com.intellij.openapi.util.IconLoader
import java.util.concurrent.atomic.AtomicBoolean

internal class ColorToolWindowIconPatcherActivity : ProjectActivity {
    override suspend fun execute(project: Project) {
        ensureInstalled()
    }

    companion object {
        private val installed = AtomicBoolean(false)

        fun ensureInstalled() {
            if (!installed.compareAndSet(false, true)) {
                return
            }
            IconLoader.installPathPatcher(ColorToolWindowIconsPatcher)
            ColorToolWindowLafListener.register()
        }
    }
}
