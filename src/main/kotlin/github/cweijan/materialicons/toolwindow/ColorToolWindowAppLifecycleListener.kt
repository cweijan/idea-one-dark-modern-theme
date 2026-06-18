package github.cweijan.materialicons.toolwindow

import com.intellij.ide.AppLifecycleListener

internal class ColorToolWindowAppLifecycleListener : AppLifecycleListener {
    override fun appFrameCreated(commandLineArgs: List<String>) {
        ColorToolWindowIconPatcherInstaller.ensureInstalled()
    }
}
