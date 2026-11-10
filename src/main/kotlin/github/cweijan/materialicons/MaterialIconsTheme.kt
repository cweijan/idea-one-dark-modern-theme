package github.cweijan.materialicons

import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import com.google.gson.JsonPrimitive

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
        fun load(): MaterialIconsTheme {
            val stream = MaterialIconsTheme::class.java.getResourceAsStream("/material-icons.json")
                ?: error("material-icons.json not found in plugin resources")
            val root = stream.reader().use { JsonParser.parseReader(it) }

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

        private fun parseIconDefinitions(node: JsonElement?): Map<String, String> {
            val result = LinkedHashMap<String, String>()
            if (node !is JsonObject) {
                return result
            }
            for (entry in node.entrySet()) {
                val iconPath = entry.value.path("iconPath").asText()
                result[entry.key] = normalizeIconPath(iconPath)
            }
            return result
        }

        private fun parseStringMap(node: JsonElement?): Map<String, String> {
            val result = LinkedHashMap<String, String>()
            if (node !is JsonObject) {
                return result
            }
            for (entry in node.entrySet()) {
                result[entry.key.lowercase()] = entry.value.asText()
            }
            return result
        }

        // Missing values are represented as null, like Jackson's JsonNode.path().
        private fun JsonElement?.path(name: String): JsonElement? = (this as? JsonObject)?.get(name)

        // Same results as Jackson's JsonNode.asText(): "" for missing values and objects, "null" for JSON null.
        private fun JsonElement?.asText(): String = when {
            this is JsonPrimitive -> asString
            this != null && isJsonNull -> "null"
            else -> ""
        }

        // Same results as Jackson's JsonNode.asText(defaultValue): the default replaces missing and null values.
        private fun JsonElement?.asText(defaultValue: String): String =
            if (this == null || isJsonNull) defaultValue else asText()

        private fun normalizeIconPath(iconPath: String): String {
            val fileName = iconPath.substringAfterLast('/')
            return "/icons/$fileName"
        }
    }
}
