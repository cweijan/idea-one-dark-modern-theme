package github.cweijan.materialicons.toolwindow

import com.intellij.openapi.util.IconPathPatcher
import com.intellij.ui.ColorUtil
import com.intellij.util.ui.JBUI
import java.util.concurrent.ConcurrentHashMap

internal object ColorToolWindowIconsPatcher : IconPathPatcher() {
    private val pathCache = ConcurrentHashMap<String, String>()
    private val classLoaderCache = ConcurrentHashMap<String, ClassLoader?>()

    override fun getContextClassLoader(path: String, originalClassLoader: ClassLoader?): ClassLoader? {
        classLoaderCache.putIfAbsent(path, originalClassLoader)
        return if (ToolWindowIconReplacements.lightIconFor(path) != null) {
            javaClass.classLoader
        } else {
            classLoaderCache[path]
        }
    }

    override fun patchPath(path: String, classLoader: ClassLoader?): String? {
        val lightIcon = ToolWindowIconReplacements.lightIconFor(path) ?: return null

        val dark = isDarkTheme()
        val cacheKey = "$path:$dark"
        pathCache[cacheKey]?.let { return it }

        val replacement = resolveIcon(lightIcon, dark) ?: return null
        pathCache[cacheKey] = replacement
        return replacement
    }

    fun clearCache() {
        pathCache.clear()
        classLoaderCache.clear()
    }

    private fun resolveIcon(lightIcon: String, dark: Boolean): String? {
        if (!dark) {
            return lightIcon.takeIf { resourceExists(it) }
        }

        val darkIcon = ToolWindowIconReplacements.darkIconFor(lightIcon)
        return when {
            resourceExists(darkIcon) -> darkIcon
            resourceExists(lightIcon) -> lightIcon
            else -> null
        }
    }

    private fun resourceExists(path: String): Boolean {
        return ColorToolWindowIconsPatcher::class.java.getResource(path) != null
    }

    private fun isDarkTheme(): Boolean {
        return ColorUtil.isDark(JBUI.CurrentTheme.ToolWindow.background())
    }
}
