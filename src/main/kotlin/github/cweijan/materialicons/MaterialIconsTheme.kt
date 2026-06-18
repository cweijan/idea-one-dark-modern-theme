package github.cweijan.materialicons

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper

internal data class MaterialIconsTheme(
    val iconDefinitions: Map<String, String>,
    val fileExtensions: Map<String, String>,
    val fileNames: Map<String, String>,
    val folderNames: Map<String, String>,
    val folderNamesExpanded: Map<String, String>,
    val lightFileExtensions: Map<String, String>,
    val lightFileNames: Map<String, String>,
    val lightFolderNames: Map<String, String>,
    val lightFolderNamesExpanded: Map<String, String>,
    val defaultFileIcon: String,
    val defaultFolderIcon: String,
    val defaultFolderExpandedIcon: String,
    val defaultRootFolderIcon: String,
    val defaultRootFolderExpandedIcon: String,
) {
    companion object {
        private val mapper = ObjectMapper()

        fun load(): MaterialIconsTheme {
            val stream = MaterialIconsTheme::class.java.getResourceAsStream("/material-icons.json")
                ?: error("material-icons.json not found in plugin resources")
            val root = mapper.readTree(stream)

            return MaterialIconsTheme(
                iconDefinitions = parseIconDefinitions(root.path("iconDefinitions")),
                fileExtensions = parseStringMap(root.path("fileExtensions")),
                fileNames = parseStringMap(root.path("fileNames")),
                folderNames = parseStringMap(root.path("folderNames")),
                folderNamesExpanded = parseStringMap(root.path("folderNamesExpanded")),
                lightFileExtensions = parseStringMap(root.path("light").path("fileExtensions")),
                lightFileNames = parseStringMap(root.path("light").path("fileNames")),
                lightFolderNames = parseStringMap(root.path("light").path("folderNames")),
                lightFolderNamesExpanded = parseStringMap(root.path("light").path("folderNamesExpanded")),
                defaultFileIcon = root.path("file").asText("file"),
                defaultFolderIcon = root.path("folder").asText("folder"),
                defaultFolderExpandedIcon = root.path("folderExpanded").asText("folder-open"),
                defaultRootFolderIcon = root.path("rootFolder").asText("folder-root"),
                defaultRootFolderExpandedIcon = root.path("rootFolderExpanded").asText("folder-root-open"),
            )
        }

        private fun parseIconDefinitions(node: JsonNode): Map<String, String> {
            val result = LinkedHashMap<String, String>()
            if (!node.isObject) {
                return result
            }
            val fields = node.fields()
            while (fields.hasNext()) {
                val entry = fields.next()
                val iconPath = entry.value.path("iconPath").asText()
                result[entry.key] = normalizeIconPath(iconPath)
            }
            return result
        }

        private fun parseStringMap(node: JsonNode): Map<String, String> {
            val result = LinkedHashMap<String, String>()
            if (!node.isObject) {
                return result
            }
            val fields = node.fields()
            while (fields.hasNext()) {
                val entry = fields.next()
                result[entry.key.lowercase()] = entry.value.asText()
            }
            return result
        }

        private fun normalizeIconPath(iconPath: String): String {
            val fileName = iconPath.substringAfterLast('/')
            return "/icons/$fileName"
        }
    }
}
