package github.cweijan.materialicons.toolwindow

import com.intellij.openapi.diagnostic.thisLogger
import org.xml.sax.InputSource
import javax.xml.parsers.DocumentBuilderFactory

internal object ToolWindowIconReplacements {
    private const val RESOURCE = "/color_toolwindow_icons.xml"

    private val pathToLightIcon: Map<String, String> by lazy { load() }

    fun lightIconFor(path: String): String? = pathToLightIcon[path]

    fun darkIconFor(lightIcon: String): String {
        return lightIcon.removeSuffix(".svg") + "_dark.svg"
    }

    private fun load(): Map<String, String> {
        val stream = ToolWindowIconReplacements::class.java.getResourceAsStream(RESOURCE)
            ?: run {
                logger.warn("Missing tool window icon replacements: $RESOURCE")
                return emptyMap()
            }

        val document = DocumentBuilderFactory.newInstance().newDocumentBuilder()
            .parse(InputSource(stream.reader()))
        val result = LinkedHashMap<String, String>()
        val replacements = document.documentElement.getElementsByTagName("iconReplacement")
        for (index in 0 until replacements.length) {
            val replacement = replacements.item(index)
            val lightIcon = replacement.attributes.getNamedItem("icon")?.nodeValue ?: continue
            val paths = replacement.childNodes
            for (pathIndex in 0 until paths.length) {
                val node = paths.item(pathIndex)
                if (node.nodeName != "replacePath") {
                    continue
                }
                val platformPath = node.attributes.getNamedItem("path")?.nodeValue ?: continue
                result[platformPath] = lightIcon
            }
        }
        return result
    }

    private val logger = thisLogger()
}
