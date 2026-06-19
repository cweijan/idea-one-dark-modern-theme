package github.cweijan.materialicons

import com.intellij.ide.projectView.PresentationData
import com.intellij.ide.projectView.ProjectViewNode
import com.intellij.ide.projectView.ProjectViewNodeDecorator

class MaterialProjectViewDecorator : ProjectViewNodeDecorator {
    override fun decorate(node: ProjectViewNode<*>, data: PresentationData) {
        val file = node.virtualFile ?: return
        if (!file.isDirectory) {
            return
        }

        val project = node.project
        if (project == null || project.isDisposed) {
            return
        }
        if (!MaterialFolderScope.isFirstLevelFolder(file, project)) {
            return
        }

        val iconId = MaterialIconRegistry.resolveIconId(
            fileName = file.name,
            isDirectory = true,
            isExpanded = false,
            isRoot = false,
        )
        if (iconId == null) return
        val icon = MaterialIconRegistry.getIcon(iconId) ?: return
        data.setIcon(icon)
    }
}
