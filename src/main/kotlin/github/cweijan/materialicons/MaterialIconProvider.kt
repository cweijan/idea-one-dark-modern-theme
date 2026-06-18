package github.cweijan.materialicons

import com.intellij.ide.IconProvider
import com.intellij.openapi.project.DumbAware
import com.intellij.psi.PsiElement
import com.intellij.psi.util.PsiUtilCore
import javax.swing.Icon

class MaterialIconProvider : IconProvider(), DumbAware {
    override fun getIcon(element: PsiElement, flags: Int): Icon? {
        val virtualFile = PsiUtilCore.getVirtualFile(element) ?: return null
        return MaterialIconRegistry.getVirtualFileIcon(virtualFile, flags, element.project)
    }
}
