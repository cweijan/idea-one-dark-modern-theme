#!/usr/bin/env node
/**
 * One Dark Modern palette for IntelliJ.
 * Colors follow the VS Code One Dark Modern theme; layout keys are IDEA-specific.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const XML_PATH = path.join(ROOT, 'src/main/resources/theme/one_dark_modern.xml');
const THEME_JSON_PATH = path.join(ROOT, 'src/main/resources/theme/one_dark_modern.theme.json');

// ── One Dark Modern (VS Code) + IDEA refinements ─────────────────
const P = {
  // Surfaces
  editor: '282c34',
  chrome: '21252b',
  elevated: '2c313c',
  input: '252931',
  overlay: '1d1f23',
  popup: '21252b',
  header: '282c34',
  border: '3e4452',
  borderSubtle: '2e323a',

  // Text
  text: 'abb2bf',
  textBright: 'd7dae0',
  textSecondary: '6f7784',
  textMuted: '5c6370',
  textDoc: '6d7683',
  textStatus: '9da5b4',
  textExcluded: '8b919d',

  // Accent
  blue: '528bff',
  accent: '4d78cc',
  selection: '3e4451',
  selectionList: '2c313c',
  selectionInactive: '323842',

  // Buttons — solid secondary + deep blue primary
  button: '2c313c',
  buttonHover: '333841',
  buttonPressed: '383e4a',
  buttonBorder: '3e4452',
  buttonBorderHover: '484e58',
  buttonSecondary: '30333d',
  buttonPrimary: '3a72d6',
  buttonPrimaryHover: '4a82e4',
  buttonPrimaryBorder: '2a5ab8',
  buttonPrimaryFocus: '528ee8',
  buttonTextOnPrimary: 'ffffff',
  buttonFocus: '3a72d6',
  actionHover: '3a72d628',
  actionPressed: '3a72d640',

  // Syntax (classic One Dark, tuned for readability)
  keyword: 'c678dd',
  string: '98c379',
  number: 'd19a66',
  function: '61afef',
  class: 'e5c07b',
  interface: '56b6c2',
  field: 'e06c75',
  operator: '56b6c2',
  annotation: 'd19a66',
  tag: 'e06c75',
  error: 'e06c75',
  warning: 'e5c07b',

  // VCS
  vcsAdd: '549e6a',
  vcsDelete: 'be5046',
  vcsModify: 'e5c07b',

  // Diff backgrounds (subtle tints)
  diffAdd: '2d3b32',
  diffDelete: '3d2b2e',
  diffModify: '3d3828',
};

// Safe global remaps (old broken port → curated)
const GLOBAL_REMAP = {
  c792ea: P.keyword,
  C792EA: P.keyword.toUpperCase(),
  '92d69e': P.string,
  '92D69E': P.string.toUpperCase(),
  '848b96': P.textMuted,
  '848B96': P.textMuted.toUpperCase(),
  dbb979: P.class,
  DBB979: P.class.toUpperCase(),
  ebb07a: P.number,
  EBB07A: P.number.toUpperCase(),
  c85f56: P.error,
  C85F56: P.error.toUpperCase(),
  db7079: P.field,
  DB7079: P.field.toUpperCase(),
  '109868': P.vcsAdd,
  '9A353D': P.vcsDelete,
  '948B60': P.vcsModify,
  '3A3F4B': P.selection,
  '3a3f4b': P.selection,
  '21252b': P.chrome,
  '21252B': P.chrome.toUpperCase(),
  '282c34': P.editor,
  '282C34': P.editor.toUpperCase(),
  '1e2127': P.input,
  '1E2127': P.overlay.toUpperCase(),
  // JetBrains Gray drift → One Dark Modern
  '2b2d30': P.chrome,
  '2B2D30': P.chrome.toUpperCase(),
  '2d3139': P.editor,
  '2D3139': P.editor.toUpperCase(),
  '353942': P.elevated,
  '333841': P.input,
  '32353d': P.header,
  '434956': P.selectionList,
  '3a3f48': P.selectionInactive,
  '484e58': P.border,
  '3e424a': P.borderSubtle,
  '404754': P.buttonHover,
  '525761': P.buttonPressed,
  '545a68': P.buttonBorder,
  '565d6b': P.buttonBorderHover,
  '4f575f': P.textExcluded,
  '4F575F': P.textExcluded.toUpperCase(),
  ffffff1d: '3a3f4b',
  FFFFFF1D: '3A3F4B',
};

const COLOR_PROPS = ['FOREGROUND', 'BACKGROUND', 'EFFECT_COLOR', 'ERROR_STRIPE_COLOR'];

const COLORS_OVERRIDES = {
  ADDED_LINES_COLOR: P.vcsAdd.toUpperCase(),
  DELETED_LINES_COLOR: P.vcsDelete.toUpperCase(),
  MODIFIED_LINES_COLOR: P.vcsModify.toUpperCase(),
  ANNOTATIONS_COLOR: P.textSecondary.toUpperCase(),
  CARET_COLOR: P.blue.toUpperCase(),
  CARET_ROW_COLOR: P.elevated.toUpperCase(),
  GUTTER_BACKGROUND: P.editor.toUpperCase(),
  LINE_NUMBERS_COLOR: '495162',
  LINE_NUMBER_ON_CARET_ROW_COLOR: P.textSecondary.toUpperCase(),
  LOOKUP_COLOR: P.chrome.toUpperCase(),
  SELECTION_BACKGROUND: P.selection.toUpperCase(),
  SELECTION_FOREGROUND: P.textBright.toUpperCase(),
  INDENT_GUIDE: '3A3F4B',
  SELECTED_INDENT_GUIDE: '565C64',
  VISUAL_INDENT_GUIDE: '3A3F4B',
  RIGHT_MARGIN_COLOR: '3A3F4B',
  METHOD_SEPARATORS_COLOR: P.borderSubtle.toUpperCase(),
  DOCUMENTATION_COLOR: P.elevated.toUpperCase(),
  INFORMATION_HINT: P.elevated.toUpperCase(),
  ERROR_HINT: '5C2B2B',
  DIFF_SEPARATORS_BACKGROUND: P.chrome.toUpperCase(),
  DIAGRAM_ANNOTATION_EDGE: P.number.toUpperCase(),
  DIAGRAM_INNER_EDGE: P.field.toUpperCase(),
  DIAGRAM_REALIZATION_EDGE: P.string.toUpperCase(),
  DIAGRAM_NOTE_BORDER: P.textMuted.toUpperCase(),
  HTML_TAG_TREE_LEVEL0: P.tag.toUpperCase(),
  HTML_TAG_TREE_LEVEL1: P.class.toUpperCase(),
  HTML_TAG_TREE_LEVEL2: P.string.toUpperCase(),
  HTML_TAG_TREE_LEVEL3: P.interface.toUpperCase(),
  HTML_TAG_TREE_LEVEL4: P.function.toUpperCase(),
  HTML_TAG_TREE_LEVEL5: P.keyword.toUpperCase(),
  WHITESPACES: '3A3F4B',
  WHITESPACES_MODIFIED_LINES_COLOR: '565C64',
  'Bookmark.Mnemonic.iconBorderColor': P.blue.toUpperCase(),
  'BookmarkMnemonicIcon.borderColor': P.blue.toUpperCase(),
  FILESTATUS_IDEA_FILESTATUS_IGNORED: P.textExcluded.toUpperCase(),
  'FILESTATUS_IGNORE.PROJECT_VIEW.IGNORED': P.textExcluded.toUpperCase(),
  FILESTATUS_DELETED: P.textExcluded.toUpperCase(),
  FILESTATUS_IDEA_FILESTATUS_DELETED_FROM_FILE_SYSTEM: P.textExcluded.toUpperCase(),
  FILESTATUS_SUPPRESSED: P.textExcluded.toUpperCase(),
};

const ATTRIBUTE_OVERRIDES = {
  TEXT: { FOREGROUND: P.text, BACKGROUND: P.editor },
  DEFAULT_KEYWORD: { FOREGROUND: P.keyword },
  DEFAULT_BLOCK_COMMENT: { FOREGROUND: P.textMuted },
  DEFAULT_LINE_COMMENT: { FOREGROUND: P.textMuted },
  DEFAULT_DOC_COMMENT: { FOREGROUND: P.textDoc },
  DEFAULT_DOC_COMMENT_TAG: { FOREGROUND: P.keyword },
  DEFAULT_DOC_COMMENT_TAG_VALUE: { FOREGROUND: P.number },
  DEFAULT_STRING: { FOREGROUND: P.string },
  DEFAULT_CLASS_NAME: { FOREGROUND: P.class },
  DEFAULT_CLASS_REFERENCE: { FOREGROUND: P.class },
  DEFAULT_INTERFACE_NAME: { FOREGROUND: P.interface },
  DEFAULT_FUNCTION_CALL: { FOREGROUND: P.function },
  DEFAULT_FUNCTION_DECLARATION: { FOREGROUND: P.function },
  DEFAULT_STATIC_METHOD: { FOREGROUND: P.function },
  DEFAULT_NUMBER: { FOREGROUND: P.number },
  DEFAULT_CONSTANT: { FOREGROUND: P.number },
  DEFAULT_PARAMETER: { FOREGROUND: P.text },
  DEFAULT_REASSIGNED_PARAMETER: { FOREGROUND: P.number },
  DEFAULT_ATTRIBUTE: { FOREGROUND: P.number },
  DEFAULT_INSTANCE_FIELD: { FOREGROUND: P.field },
  DEFAULT_STATIC_FIELD: { FOREGROUND: P.field },
  DEFAULT_GLOBAL_VARIABLE: { FOREGROUND: P.field },
  DEFAULT_IDENTIFIER: { FOREGROUND: P.text },
  DEFAULT_ENTITY: { FOREGROUND: P.field },
  DEFAULT_METADATA: { FOREGROUND: P.class },
  DEFAULT_VALID_STRING_ESCAPE: { FOREGROUND: P.interface },
  DEFAULT_INVALID_STRING_ESCAPE: { FOREGROUND: P.interface, EFFECT_COLOR: P.error },
  DEFAULT_LOCAL_VARIABLE: { FOREGROUND: P.text },
  DEFAULT_REASSIGNED_LOCAL_VARIABLE: { FOREGROUND: P.text },
  XML_TAG_NAME: { FOREGROUND: P.tag },
  XML_ATTRIBUTE_NAME: { FOREGROUND: P.number },
  XML_ENTITY_REFERENCE: { FOREGROUND: P.field },
  XML_PROLOGUE: { FOREGROUND: P.text, BACKGROUND: P.editor },
  CONSOLE_NORMAL_OUTPUT: { FOREGROUND: P.text },
  CONSOLE_ERROR_OUTPUT: { FOREGROUND: P.error },
  CONSOLE_RED_OUTPUT: { FOREGROUND: P.error },
  CONSOLE_RED_BRIGHT_OUTPUT: { FOREGROUND: P.error },
  CONSOLE_GREEN_OUTPUT: { FOREGROUND: P.string },
  CONSOLE_GREEN_BRIGHT_OUTPUT: { FOREGROUND: P.string },
  CONSOLE_BLUE_OUTPUT: { FOREGROUND: P.function },
  CONSOLE_BLUE_BRIGHT_OUTPUT: { FOREGROUND: P.function },
  CONSOLE_CYAN_OUTPUT: { FOREGROUND: P.interface },
  CONSOLE_CYAN_BRIGHT_OUTPUT: { FOREGROUND: P.interface },
  CONSOLE_MAGENTA_OUTPUT: { FOREGROUND: P.keyword },
  CONSOLE_MAGENTA_BRIGHT_OUTPUT: { FOREGROUND: P.keyword },
  CONSOLE_YELLOW_OUTPUT: { FOREGROUND: P.number },
  CONSOLE_YELLOW_BRIGHT_OUTPUT: { FOREGROUND: P.number },
  CONSOLE_USER_INPUT: { FOREGROUND: P.string },
  DIFF_INSERTED: { BACKGROUND: P.diffAdd, ERROR_STRIPE_COLOR: P.vcsAdd.toUpperCase() },
  DIFF_DELETED: { BACKGROUND: P.diffDelete, ERROR_STRIPE_COLOR: P.vcsDelete.toUpperCase() },
  DIFF_MODIFIED: { BACKGROUND: P.diffModify, ERROR_STRIPE_COLOR: P.vcsModify.toUpperCase() },
  DELETED_TEXT_ATTRIBUTES: { BACKGROUND: P.diffDelete },
  DIFF_CONFLICT: { BACKGROUND: '5c2b2b', ERROR_STRIPE_COLOR: P.error.toUpperCase() },
  TEXT_SEARCH_RESULT_ATTRIBUTES: {
    BACKGROUND: '3d4f72',
    EFFECT_COLOR: P.blue,
    ERROR_STRIPE_COLOR: P.blue.toUpperCase(),
  },
  WRITE_SEARCH_RESULT_ATTRIBUTES: { BACKGROUND: '3d4f72', EFFECT_COLOR: P.blue },
  WRONG_REFERENCES_ATTRIBUTES: { FOREGROUND: P.error, EFFECT_COLOR: P.error },
  WARNING_ATTRIBUTES: { EFFECT_COLOR: P.warning, ERROR_STRIPE_COLOR: P.warning.toUpperCase() },
  TODO_DEFAULT_ATTRIBUTES: { FOREGROUND: P.warning },
  TYPO: { EFFECT_COLOR: P.string },
  UNMATCHED_BRACE_ATTRIBUTES: { BACKGROUND: '5c2b2b' },
  BREAKPOINT_ATTRIBUTES: { BACKGROUND: '5c2b2b' },
  BAD_CHARACTER: { BACKGROUND: '5c2b2b' },
  BREADCRUMBS_CURRENT: { FOREGROUND: P.textBright, BACKGROUND: P.elevated },
  BREADCRUMBS_HOVERED: { FOREGROUND: P.textBright, BACKGROUND: P.elevated },
  TERMINAL_COMMAND_TO_RUN_USING_IDE: { BACKGROUND: P.editor },
  VELOCITY_SCRIPTING_BACKGROUND: { BACKGROUND: P.editor },
};

function applyGlobalRemap(xml) {
  let result = xml;
  for (const prop of COLOR_PROPS) {
    for (const [from, to] of Object.entries(GLOBAL_REMAP)) {
      const re = new RegExp(`(${prop}" value=")${from}`, 'g');
      result = result.replace(re, `$1${to}`);
    }
  }
  return result;
}

function applyColorsOverrides(xml) {
  let result = xml;
  for (const [name, value] of Object.entries(COLORS_OVERRIDES)) {
    const re = new RegExp(`(<option name="${name.replace(/\./g, '\\.')}" value=")[^"]*(")`, 'g');
    if (re.test(result)) {
      result = result.replace(re, `$1${value}$2`);
    } else {
      result = result.replace(
        /(<option name="FILESTATUS_IDEA_FILESTATUS_IGNORED" value="[^"]*" \/>)/,
        `$1\n        <option name="${name}" value="${value}" />`
      );
    }
  }
  return result;
}

function setAttributeColor(xml, attrName, prop, value) {
  const blockRe = new RegExp(
    `(<option name="${attrName}">[\\s\\S]*?<option name="${prop}" value=")[^"]*(")`,
    'g'
  );
  return xml.replace(blockRe, `$1${value}$2`);
}

function applyAttributeOverrides(xml) {
  let result = xml;
  for (const [attrName, override] of Object.entries(ATTRIBUTE_OVERRIDES)) {
    for (const [prop, value] of Object.entries(override)) {
      result = setAttributeColor(result, attrName, prop, value);
    }
  }
  return result;
}

// New UI spacing only — colors come from One Dark Modern palette above
const NEW_UI_LAYOUT = {
  parentTheme: 'Darcula',
  Button: {
    // Darcula default: 72x24; horizontal text padding is fixed at 14px per side in the LAF
    minimumSize: '74, 27',
  },
  ComboBox: {
    // Darcula default padding: 1,6,1,6; minimumSize: 49x24
    padding: '2,8,2,7',
    minimumSize: '49,26',
  },
  Tree: {
    rowHeight: 24,
    border: '4,12,4,12',
    hoverBackground: null,
    hoverInactiveBackground: null,
    selectionBackground: null,
    selectionInactiveBackground: null,
  },
  List: {
    rowHeight: 24,
    border: '4,0,4,0',
    hoverBackground: null,
    hoverInactiveBackground: null,
    selectionBackground: null,
    selectionInactiveBackground: null,
    Button: {
      hoverBackground: null,
      leftRightInset: 9,
      separatorInset: 4,
    },
  },
  'SidePanel.background': null,
};

function resolveLayoutColors() {
  return {
    Tree: {
      ...NEW_UI_LAYOUT.Tree,
      hoverBackground: `#${P.elevated}`,
      hoverInactiveBackground: `#${P.chrome}`,
      selectionBackground: `#${P.selectionList}`,
      selectionInactiveBackground: `#${P.selectionInactive}`,
      hash: `#${P.border}`,
    },
    List: {
      ...NEW_UI_LAYOUT.List,
      hoverBackground: `#${P.elevated}`,
      hoverInactiveBackground: `#${P.chrome}`,
      selectionBackground: `#${P.selectionList}`,
      selectionInactiveBackground: `#${P.selectionInactive}`,
      Button: {
        ...NEW_UI_LAYOUT.List.Button,
        hoverBackground: `#${P.selectionList}`,
      },
    },
  };
}

function updateThemeJson() {
  const theme = JSON.parse(fs.readFileSync(THEME_JSON_PATH, 'utf8'));
  const layout = resolveLayoutColors();
  const chromeTransparent = `#${P.chrome}00`;

  theme.parentTheme = NEW_UI_LAYOUT.parentTheme;

  theme.colors = {
    chrome: `#${P.chrome}`,
    editor: `#${P.editor}`,
    elevated: `#${P.elevated}`,
    popup: `#${P.popup}`,
    input: `#${P.input}`,
    header: `#${P.header}`,
    overlay: `#${P.overlay}`,
    border: `#${P.border}`,
    accent: `#${P.accent}`,
    text: `#${P.text}`,
    textBright: `#${P.textBright}`,
  };

  theme.ui['*'] = {
    background: 'chrome',
    borderColor: `#${P.borderSubtle}`,
    foreground: 'text',
    separatorColor: `#${P.borderSubtle}`,
    selectionBackground: `#${P.selectionList}`,
    selectionForeground: 'textBright',
    selectionInactiveBackground: `#${P.selectionInactive}`,
    focusedBorderColor: `#${P.blue}`,
    focusColor: `#${P.blue}`,
    lightSelectionBackground: `#${P.selectionList}`,
    inactiveForeground: `#${P.textExcluded}`,
    disabledForeground: `#${P.textExcluded}`,
    infoForeground: `#${P.textSecondary}`,
    inactiveBackground: 'chrome',
  };

  Object.assign(theme.ui, {
    'Component.borderColor': `#${P.border}`,
    ActionButton: {
      hoverBackground: `#${P.actionHover}`,
      hoverBorderColor: '#00000000',
      pressedBackground: `#${P.actionPressed}`,
      pressedBorderColor: '#00000000',
    },
    Borders: { color: `#${P.borderSubtle}`, ContrastBorderColor: 'editor' },
    'ComboBoxButton.background': `#${P.overlay}`,
    Button: {
      foreground: 'textBright',
      startBackground: `#${P.button}`,
      endBackground: `#${P.button}`,
      startBorderColor: `#${P.buttonBorder}`,
      endBorderColor: `#${P.buttonBorder}`,
      focusedBorderColor: `#${P.buttonFocus}`,
      arc: 8,
      minimumSize: NEW_UI_LAYOUT.Button.minimumSize,
      default: {
        foreground: `#${P.buttonTextOnPrimary}`,
        startBackground: `#${P.buttonPrimary}`,
        endBackground: `#${P.buttonPrimary}`,
        startBorderColor: `#${P.buttonPrimaryBorder}`,
        endBorderColor: `#${P.buttonPrimaryBorder}`,
        focusedBorderColor: `#${P.buttonPrimaryFocus}`,
        shadowColor: 'chrome',
      },
    },
    DefaultTabs: {
      underlineColor: `#${P.blue}`,
      inactiveUnderlineColor: `#${P.accent}`,
      hoverBackground: `#${P.elevated}`,
    },
    Editor: {
      background: 'editor',
      foreground: 'text',
    },
    MainToolbar: {
      background: 'chrome',
      inactiveBackground: 'editor',
    },
    Link: {
      activeForeground: `#${P.function}`,
      hoverForeground: `#${P.function}`,
      pressedForeground: `#${P.function}`,
      visitedForeground: `#${P.function}`,
    },
    ToolWindow: {
      background: 'chrome',
      Header: {
        background: 'header',
        inactiveBackground: 'chrome',
        borderColor: `#${P.borderSubtle}`,
        'font.size.offset': 0,
      },
      HeaderTab: {
        hoverBackground: `#${P.elevated}`,
        hoverInactiveBackground: `#${P.elevated}`,
      },
      Button: {
        foreground: `#${P.textSecondary}`,
        hoverBackground: `#${P.actionHover}`,
        selectedForeground: `#${P.buttonTextOnPrimary}`,
        selectedBackground: `#${P.buttonPrimary}`,
      },
      Stripe: {
        separatorColor: `#${P.borderSubtle}`,
      },
    },
    CompletionPopup: {
      background: 'popup',
      selectionBackground: `#${P.selectionList}`,
      selectionForeground: 'textBright',
    },
    SearchEverywhere: {
      'Header.background': 'chrome',
      SearchField: { background: `#${P.input}`, borderColor: `#${P.borderSubtle}` },
      'Tab.selectedBackground': `#${P.selectionList}`,
    },
    Plugins: {
      background: 'chrome',
      Tab: {
        selectedForeground: 'textBright',
        selectedBackground: `#${P.selectionList}`,
        hoverBackground: `#${P.elevated}`,
      },
      'SearchField.borderColor': `#${P.border}`,
      'SearchField.background': `#${P.input}`,
      'SectionHeader.background': `#${P.elevated}`,
      'SectionHeader.foreground': 'textBright',
      tagBackground: `#${P.buttonSecondary}`,
      tagForeground: 'textBright',
      Button: {
        installForeground: `#${P.buttonPrimary}`,
        installBorderColor: `#${P.buttonPrimaryBorder}`,
        installFillForeground: 'textBright',
        installFillBackground: `#${P.button}`,
        updateForeground: `#${P.buttonTextOnPrimary}`,
        updateBackground: `#${P.buttonPrimary}`,
        updateBorderColor: `#${P.buttonPrimaryBorder}`,
      },
    },
    ToggleButton: {
      onForeground: `#${P.buttonTextOnPrimary}`,
      onBackground: `#${P.buttonPrimary}`,
      offForeground: `#${P.textSecondary}`,
      offBackground: `#${P.button}`,
      borderColor: `#${P.buttonBorder}`,
      buttonColor: `#${P.buttonBorderHover}`,
    },
    TextArea: { background: `#${P.input}` },
    TextField: { background: `#${P.input}` },
    Panel: { background: 'chrome' },
    Label: {
      foreground: 'text',
      infoForeground: `#${P.textSecondary}`,
    },
    TitlePane: {
      infoForeground: 'text',
      inactiveInfoForeground: `#${P.textSecondary}`,
    },
    'Group.separatorColor': `#${P.border}`,
    Menu: { background: 'popup', foreground: 'text' },
    Popup: {
      background: `#${P.popup}`,
      paintBorder: true,
      borderColor: `#${P.border}`,
      inactiveBorderColor: `#${P.borderSubtle}`,
      'Header.activeBackground': `#${P.popup}`,
      'Header.inactiveBackground': `#${P.popup}`,
      'Header.activeForeground': 'text',
      'Header.inactiveForeground': 'textSecondary',
      'Header.insets': '8,12,8,12',
      separatorForeground: `#${P.textSecondary}`,
      separatorColor: `#${P.borderSubtle}`,
      separatorLabelInsets: '4,12,4,12',
    },
    'ComplexPopup.Header.background': `#${P.popup}`,
    SpeedSearch: {
      foreground: 'textBright',
      background: `#${P.elevated}`,
      borderColor: `#${P.border}`,
    },
    MenuBar: { foreground: `#${P.textStatus}`, borderColor: 'chrome' },
    ComboBox: {
      'ArrowButton.nonEditableBackground': `#${P.overlay}`,
      'ArrowButton.iconColor': `#${P.textSecondary}`,
      nonEditableBackground: `#${P.overlay}`,
      background: `#${P.input}`,
      padding: NEW_UI_LAYOUT.ComboBox.padding,
      minimumSize: NEW_UI_LAYOUT.ComboBox.minimumSize,
    },
    'SidePanel.background': 'chrome',
    Tree: layout.Tree,
    List: layout.List,
    EditorTabs: {
      background: 'chrome',
      selectedBackground: 'chrome',
      underlinedTabBackground: 'chrome',
      inactiveColoredFileBackground: 'chrome',
      selectedForeground: 'textBright',
      underlinedTabForeground: 'textBright',
      inactiveMaskColor: 'chrome',
      underlineColor: `#${P.blue}`,
      underlineHeight: 2,
      borderColor: 'chrome',
      hoverBackground: chromeTransparent,
      hoverInactiveBackground: chromeTransparent,
    },
    ProgressBar: {
      progressColor: `#${P.blue}`,
      indeterminateEndColor: `#${P.blue}`,
    },
    FileColor: {
      Yellow: '#3d3828',
      Gray: '#2a2d35',
    },
  });

  theme.icons.ColorPalette = {
    'Actions.Grey': `#${P.textSecondary}`,
    'Actions.Red': `#${P.error}`,
    'Actions.Yellow': `#${P.warning}`,
    'Actions.Green': `#${P.vcsAdd}`,
    'Actions.Blue': `#${P.blue}`,
    'Actions.GreyInline.Dark': '#7f848eb3',
    'Objects.Grey': `#${P.textSecondary}`,
    'Objects.RedStatus': `#${P.error}`,
    'Objects.Red': `#${P.field}`,
    'Objects.Pink': `#${P.keyword}`,
    'Objects.Yellow': `#${P.class}`,
    'Objects.Green': `#${P.string}`,
    'Objects.Blue': `#${P.function}`,
    'Objects.Purple': `#${P.keyword}`,
    'Objects.YellowDark': `#${P.number}`,
    'Objects.GreenAndroid': `#${P.string}`,
    'Checkbox.Background.Default.Dark': `#${P.overlay}`,
    'Checkbox.Border.Default.Dark': `#${P.buttonBorder}`,
    'Checkbox.Foreground.Selected.Dark': `#${P.text}`,
    'Checkbox.Focus.Wide.Dark': `#${P.blue}`,
    'Checkbox.Focus.Thin.Default.Dark': `#${P.overlay}`,
    'Checkbox.Focus.Thin.Selected.Dark': `#${P.overlay}`,
    'Checkbox.Background.Disabled.Dark': `#${P.chrome}`,
    'Checkbox.Border.Disabled.Dark': `#${P.border}`,
    'Checkbox.Foreground.Disabled.Dark': `#${P.textMuted}`,
  };

  fs.writeFileSync(THEME_JSON_PATH, JSON.stringify(theme, null, 2) + '\n');
}

function main() {
  let xml = fs.readFileSync(XML_PATH, 'utf8');
  xml = applyGlobalRemap(xml);
  xml = applyColorsOverrides(xml);
  xml = applyAttributeOverrides(xml);
  fs.writeFileSync(XML_PATH, xml);
  updateThemeJson();
  console.log('Applied One Dark Modern palette.');
}

main();
