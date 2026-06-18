package github.cweijan.materialicons

import com.intellij.openapi.project.Project
import com.intellij.openapi.roots.ProjectRootManager
import com.intellij.openapi.vfs.VirtualFile

internal object MaterialFolderScope {
    fun isFirstLevelFolder(file: VirtualFile, project: Project): Boolean {
        if (!file.isDirectory) {
            return false
        }
        val parent = file.parent ?: return false
        for (root in ProjectRootManager.getInstance(project).contentRoots) {
            if (root == parent) {
                return true
            }
        }
        return false
    }
}
