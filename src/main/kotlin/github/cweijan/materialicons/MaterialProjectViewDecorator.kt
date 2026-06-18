package github.cweijan.materialicons

import com.intellij.ide.projectView.PresentationData
import com.intellij.ide.projectView.ProjectViewNode
import com.intellij.ide.projectView.ProjectViewNodeDecorator

class MaterialProjectViewDecorator : ProjectViewNodeDecorator {
    override fun decorate(node: ProjectViewNode<*>, data: PresentationData) {
        val file = node.virtualFile ?: return
        val project = node.project
        if (project == null || project.isDisposed) {
            return
        }

        // ProjectViewNode has no tree reference in current API; open/closed folder icons are
        // handled via IconProvider flags. Decorator only overrides IDE-assigned folder icons.
        val icon = MaterialIconRegistry.getVirtualFileIcon(file, flags = 0, project) ?: return
        data.setIcon(icon)
    }
}
