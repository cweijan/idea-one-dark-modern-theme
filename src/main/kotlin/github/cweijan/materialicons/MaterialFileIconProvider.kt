package github.cweijan.materialicons

import com.intellij.ide.FileIconProvider
import com.intellij.openapi.project.Project
import com.intellij.openapi.roots.ProjectRootManager
import com.intellij.openapi.vfs.VirtualFile
import javax.swing.Icon

class MaterialFileIconProvider : FileIconProvider {

    companion object {
        // Formerly Iconable.ICON_FLAG_OPEN (removed in newer platform); marks expanded folder in tree.
        private const val ICON_FLAG_OPEN = 0x0004
    }

    override fun getIcon(file: VirtualFile, flags: Int, project: Project?): Icon? {
        val isExpanded = flags and ICON_FLAG_OPEN != 0
        val isRoot = project != null && isContentRoot(file, project)
        val iconId = MaterialIconRegistry.resolveIconId(
            fileName = file.name,
            isDirectory = file.isDirectory,
            isExpanded = isExpanded,
            isRoot = isRoot,
        ) ?: return null

        return MaterialIconRegistry.getIcon(iconId)
    }

    private fun isContentRoot(file: VirtualFile, project: Project): Boolean {
        for (root in ProjectRootManager.getInstance(project).contentRoots) {
            if (root == file) {
                return true
            }
        }
        return false
    }
}
