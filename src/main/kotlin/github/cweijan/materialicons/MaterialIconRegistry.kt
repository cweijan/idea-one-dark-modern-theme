package github.cweijan.materialicons

import com.intellij.openapi.util.IconLoader
import com.intellij.ui.JBColor
import com.intellij.util.IconUtil
import com.intellij.util.ui.JBUI
import javax.swing.Icon
import kotlin.math.max

internal object MaterialIconRegistry {
    private val theme: MaterialIconsTheme by lazy { MaterialIconsTheme.load() }
    private val iconCache = mutableMapOf<String, Icon>()

    private const val TREE_ICON_SIZE = 16

    fun resolveIconId(fileName: String, isDirectory: Boolean, isExpanded: Boolean, isRoot: Boolean): String {
        val lowerName = fileName.lowercase()

        if (isDirectory) {
            return resolveFolderIconId(lowerName, isExpanded, isRoot)
        }

        if (isLightTheme()) {
            theme.lightFileNames[lowerName]?.let { return it }
        }
        theme.fileNames[lowerName]?.let { return it }

        val extensionCandidates = extensionCandidates(lowerName)
        for (candidate in extensionCandidates) {
            if (isLightTheme()) {
                theme.lightFileExtensions[candidate]?.let { return it }
            }
            theme.fileExtensions[candidate]?.let { return it }
        }

        return theme.defaultFileIcon
    }

    fun getIcon(iconId: String): Icon? {
        val resourcePath = theme.iconDefinitions[iconId] ?: return null
        return iconCache.getOrPut(resourcePath) {
            val icon = IconLoader.getIcon(resourcePath, MaterialIconRegistry::class.java)
            normalizeIconSize(icon)
        }
    }

    private fun normalizeIconSize(icon: Icon): Icon {
        val target = JBUI.scale(TREE_ICON_SIZE)
        val width = icon.iconWidth
        val height = icon.iconHeight
        if (width <= 0 || height <= 0) {
            return IconUtil.toSize(icon, TREE_ICON_SIZE, TREE_ICON_SIZE)
        }

        val maxDim = max(width, height)
        val fitted = if (maxDim != target) {
            IconUtil.scale(icon, null, (target.toDouble() / maxDim).toFloat())
        } else {
            icon
        }
        return IconUtil.toSize(fitted, TREE_ICON_SIZE, TREE_ICON_SIZE)
    }

    private fun resolveFolderIconId(folderName: String, isExpanded: Boolean, isRoot: Boolean): String {
        if (isRoot) {
            return if (isExpanded) theme.defaultRootFolderExpandedIcon else theme.defaultRootFolderIcon
        }

        if (isExpanded) {
            if (isLightTheme()) {
                theme.lightFolderNamesExpanded[folderName]?.let { return it }
            }
            theme.folderNamesExpanded[folderName]?.let { return it }
            if (isLightTheme()) {
                theme.lightFolderNames[folderName]?.let { return "${it}-open" }
            }
            theme.folderNames[folderName]?.let { return "${it}-open" }
            return theme.defaultFolderExpandedIcon
        }

        if (isLightTheme()) {
            theme.lightFolderNames[folderName]?.let { return it }
        }
        theme.folderNames[folderName]?.let { return it }
        return theme.defaultFolderIcon
    }

    private fun isLightTheme(): Boolean = JBColor.isBright()

    private fun extensionCandidates(fileName: String): List<String> {
        val segments = fileName.split('.')
        if (segments.size < 2) {
            return emptyList()
        }

        val candidates = ArrayList<String>(segments.size - 1)
        for (i in 1 until segments.size) {
            candidates.add(0, segments.drop(i).joinToString("."))
        }
        return candidates
    }
}
