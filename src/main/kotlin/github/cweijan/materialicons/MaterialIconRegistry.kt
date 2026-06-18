package github.cweijan.materialicons

import com.intellij.openapi.project.Project
import com.intellij.openapi.roots.ProjectRootManager
import com.intellij.openapi.util.IconLoader
import com.intellij.openapi.vfs.VirtualFile
import com.intellij.util.IconUtil
import com.intellij.util.ui.JBUI
import com.intellij.util.ui.UIUtil
import javax.swing.Icon
import kotlin.math.max

internal object MaterialIconRegistry {
    private val theme: MaterialIconsTheme by lazy { MaterialIconsTheme.load() }
    private val iconCache = mutableMapOf<String, Icon>()

    private const val TREE_ICON_SIZE = 16

    fun getVirtualFileIcon(file: VirtualFile, flags: Int, project: Project?): Icon? {
        val isExpanded = flags and MaterialIconFlags.ICON_FLAG_OPEN != 0
        val isRoot = project != null && isContentRoot(file, project)
        val iconId = resolveIconId(
            fileName = file.name,
            isDirectory = file.isDirectory,
            isExpanded = isExpanded,
            isRoot = isRoot,
        )
        return getIcon(iconId)
    }

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

    private fun isContentRoot(file: VirtualFile, project: Project): Boolean {
        for (root in ProjectRootManager.getInstance(project).contentRoots) {
            if (root == file) {
                return true
            }
        }
        return false
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
            IconUtil.scale(icon, target.toDouble() / maxDim)
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

    private fun isLightTheme(): Boolean = !UIUtil.isUnderDarcula()

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
