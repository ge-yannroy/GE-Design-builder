// ── GE-DESIGN BUILDER — Plugin Code ──────────────────────
// Ce fichier s'exécute dans le contexte Figma (accès canvas).
// Il reçoit des messages de ui.html et exécute les actions sur le canvas.

// ── TYPES ────────────────────────────────────────────────
type TemplateId = 'liste' | 'formulaire' | 'detail';
type ContextId  = 'backoffice' | 'portail';
type SidebarPos = 'left' | 'right';

interface GenerateTemplateMsg {
  type: 'generate-template';
  templateId: TemplateId;
  context: ContextId;
  sidebarPos: SidebarPos;
}
interface InsertBlocMsg   { type: 'insert-bloc';    key: string; }
interface InsertTableMsg  { type: 'insert-table'; }
interface InsertListMsg   { type: 'insert-list'; }
interface InsertSurfaceMsg {
  type: 'insert-surface';
  colorKey: string;
  paddingKey: string;
  withShadow: boolean;
}

interface ConfigVariant {
  key: string;
  variantProperties?: Record<string, string>;
}
interface ConfigComponent { variants: ConfigVariant[]; }
type ConfigComponents = Record<string, ConfigComponent>;
interface ConfigLoadedMsg { type: 'config-loaded'; components: ConfigComponents; }

type PluginMessage =
  | GenerateTemplateMsg
  | InsertBlocMsg
  | InsertTableMsg
  | InsertListMsg
  | InsertSurfaceMsg
  | ConfigLoadedMsg;

// ── CONFIG ───────────────────────────────────────────────
const COMPONENTS = {
  header: {
    default:      '9176b5ec0bec8633bf7ceebc54a5340dc85cbf45',
    formulaire:   '08dedcd0a0f81305cd2fdfab5a82e937f5d1dd3a',
    portal_large: '5f216cf183fdf50ad19181521700af60bcd12cce',
  },
  footer: {
    edeMarche: '6bef5a1c2c0ca9fd5e1e3d531e92fd61d3209107',
    gech_big:  'c67427e268500e1e08c06de2eab28561bd2e9880',
    default:   'cab5555a980eaa9295a3d2eba0f969615d2c5feb',
  },
  breadcrumb:      'de0489e517edab69bfcacb45ab2b01af44f7f4b0',
  typescale: {
    h1_desktop: '002a25885c9a9a1974284350acd795c9e18cffdc',
    h2_desktop: 'f5018a4739010737531e650fe97f97e2a3466f79',
    h3_desktop: '5e193c281ad9439c6ce94ec11e3ee938c83ef339',
    h4_desktop: 'fe4bf9530f9b46ed1eeefd8a4aa507e37084f365',
    h5_desktop: 'ba49c86c43da814d4f8e00d301568fbc58d1fb74',
  },
  list: {
    item:     '848559d92b160753bff0708a3ba3f6437034fe83',
    selected: '629bd6014f272c0ac60a89daf195f3073baff88c',
  },
  filtersPanel:    'a6c768c54cb0b6ee972599a135ae63f69672ec55',
  ensembleFiltres: 'c65aa7b9de44708b8b047515bb1b7e51e0368ec5',
  checkbox:        '92050d9647a76fe69a3d39ece0d329813895cf24',
  radio:           '86cf41dd4230255914499e41b8cb1d06111c9eb2',
  textfield:       'ca5627e219afe3df56ba02464d4c216c140f1fd9',
  searchinput:     '1d3ba366164bc31c4ec6cc82013cf8addd7c9596',
  datepicker:      '2193710cd2399a83a9feb2e493409285f4c5fcbc',
  select:          '7cafd10e43df606bef2a85e06ec697cfaefae63b',
  tableRow:        'c118cb92284e8db3352cace2a3efa5ea591dcec3',
  tableRowStriped: '2b5d9ab597fa4454d753739e72f06aac872abf58',
  tableRowHeader:  'e76ffeb2dde47b83e8b04910fb6f68807c4a5964',
  dataDisplay:     '2b0774a1853fa72630856025f3c31778ae91a5b6',
  stackedCard:     '8afb841550dd0ecaed15e915ff5ca21ddb6c4a2b',
  accordion:       '67dbc7afac58a1ae768459e29a2ab95436029f81',
  stackedCardInfo: '20bfd7f4ef41b210bd461590d7d0ca25e698b114',
  navDrawer:       'ec5ae009c2e11c2efa318769c079a1edb947110c',
  treeView:        '6cd90332d64f1a6fe580c7d8242584c808eb4ba5',
  carousel:        'bc1792b5697ac837a32f961efe9cb3a3e50e2cd7',
  chip:            '9516b0891ca78316713bc44b9c282c7192dcabff',
  tooltip:         '1984ea01b291734e0fe5a6c575562d0eb4d37985',
  richTooltip:     'f809f9dd713a543526095e62df51b2361a503757',
  switch:          'a9f1ecd3f1464b0c4cf1fd632d47ec2d1b2efbd0',
  link:            '3ac115bfa0691755a8e97f162b3bf8a86cbcb406',
  dropdown:        '51d9efc87203fde74bdbf99064a6ceab8ae0736c',
  snackbar:        'f93aa49582ba4ab88b5d500d7584671a62a969bb',
  tabs:            '791c801189ad3509c6f8d78b42ac193d360db350',
  progressBar:     '478998167f29284105ea550c55fcb5e3a9e73131',
  captcha:         '17a7c519337ef9436d6574104a21c8837bd1e76d',
  quote:           'f4fd738f5fc8cc17a37a5d602ba8c096dd34972e',
  separator:       'c9ec0abac08cec8f17c3c678eff4b07f101341cf',
  upload:          '1977dad7eb112120052eb98e75a3474845b7688f',
  stepper: {
    steps3: '87ba38883d7da035e47c167ece1b0fd1255d123e',
    steps6: 'eb76fe831c0d9e3385d614fa77140355d8fcad38',
  },
  button: {
    filled:   '37603c9e48e8a4c4e96dbe69b430d77493fdece9',
    outlined: '9a7632ef0121c6ac6de30895106990a067876984',
    text:     'ce60e6fad81fb26e2704dcf48477ccd2c2bea3e4',
  },
};

// ── CONFIG LOADER ────────────────────────────────────────
// Called when ui.html fetches ge-builder.config.json from GitHub.
// Resolves each slot against the live variant data; falls back to the
// hardcoded key when a component or variant is absent from the config.
function applyConfig(comps: ConfigComponents): void {
  function find(
    component: string,
    match: Record<string, string>,
    fallback: string
  ): string {
    const c = comps[component];
    if (!c) return fallback;
    const v = c.variants.find(variant =>
      Object.entries(match).every(
        ([k, val]) => (variant.variantProperties || {})[k] === val
      )
    );
    return v ? v.key : fallback;
  }

  COMPONENTS.header.default       = find('GE_header',           { Device: 'Desktop', Context: 'Default' },                                                                                                           COMPONENTS.header.default);
  COMPONENTS.header.portal_large  = find('GE_header',           { Device: 'Desktop', Context: 'ge.ch large' },                                                                                                       COMPONENTS.header.portal_large);
  COMPONENTS.breadcrumb           = find('GE_Breadcrumb',        { Device: 'Desktop', Display: 'False', State: 'Selected - False' },                                                                                 COMPONENTS.breadcrumb);
  COMPONENTS.typescale.h1_desktop = find('GE_Typescale',         { 'Semantic tag': 'H1', Style: 'Headline Large', 'Recommended for': 'Desktop' },                                                                    COMPONENTS.typescale.h1_desktop);
  COMPONENTS.typescale.h2_desktop = find('GE_Typescale',         { 'Semantic tag': 'H2', Style: 'Headline Medium', 'Recommended for': 'Desktop' },                                                                   COMPONENTS.typescale.h2_desktop);
  COMPONENTS.typescale.h3_desktop = find('GE_Typescale',         { 'Semantic tag': 'H3', Style: 'Headline Small', 'Recommended for': 'Desktop' },                                                                    COMPONENTS.typescale.h3_desktop);
  COMPONENTS.typescale.h4_desktop = find('GE_Typescale',         { 'Semantic tag': 'H4', Style: 'Title Large', 'Recommended for': 'Desktop' },                                                                       COMPONENTS.typescale.h4_desktop);
  COMPONENTS.typescale.h5_desktop = find('GE_Typescale',         { 'Semantic tag': 'H5', Style: 'Title Medium', 'Recommended for': 'Desktop' },                                                                      COMPONENTS.typescale.h5_desktop);
  COMPONENTS.list.item            = find('MD_List item',          { Device: 'Desktop', Display: 'Icon + action', Style: 'White' },                                                                                   COMPONENTS.list.item);
  COMPONENTS.list.selected        = find('MD_List item',          { Device: 'Desktop', Display: 'Icon + action', Style: 'Blue' },                                                                                    COMPONENTS.list.selected);
  COMPONENTS.filtersPanel         = find('GE_FiltersPanel',       { 'is Open': 'Component state - Opened', 'KOComponent state': 'Default', Device: 'Desktop' },                                                     COMPONENTS.filtersPanel);
  COMPONENTS.ensembleFiltres      = find('GE_EnsembleDeFiltres',  { Display: 'Cas 1', Device: 'Desktop' },                                                                                                           COMPONENTS.ensembleFiltres);
  COMPONENTS.checkbox             = find('MD_Checkbox label',     { Selected: 'False', 'User interaction': 'None', 'Component state': 'Enabled', 'Error system': 'False', Size: 'Normal' },                         COMPONENTS.checkbox);
  COMPONENTS.radio                = find('MD_Radio-button',       { Selected: 'False', 'User interaction': 'None', 'Component state': 'Enabled', 'Error system': 'False' },                                         COMPONENTS.radio);
  COMPONENTS.textfield            = find('MD_TextField',          { 'User interaction': 'None', 'Component state': 'Enabled empty', 'Error system': 'False', 'is Multiline': 'False' },                             COMPONENTS.textfield);
  COMPONENTS.searchinput          = find('GE_InputSearch',        { Device: 'Default', 'User interaction': 'None', 'Component state': 'Enabled empty', 'Error system': 'False' },                                   COMPONENTS.searchinput);
  COMPONENTS.datepicker           = find('MD_Date pickers',       { 'Component state': 'In pending' },                                                                                                               COMPONENTS.datepicker);
  COMPONENTS.select               = find('MD_Cascadeselect',      { 'User interaction': 'None', 'Component state': 'Enabled empty', 'Error system': 'False', 'has Editable': 'False', 'has Menu opened': 'False', 'has Selection': 'False' }, COMPONENTS.select);
  COMPONENTS.tableRow             = find('GE_Table Row',          { 'User interaction': 'Out', 'is Header row': 'No', 'is Striped row': 'No', 'is Thick': 'No' },                                                  COMPONENTS.tableRow);
  COMPONENTS.tableRowStriped      = find('GE_Table Row',          { 'User interaction': 'Out', 'is Header row': 'No', 'is Striped row': 'Yes', 'is Thick': 'No' },                                                 COMPONENTS.tableRowStriped);
  COMPONENTS.tableRowHeader       = find('GE_Table Row',          { 'User interaction': 'Out', 'is Header row': 'Yes', 'is Striped row': 'No', 'is Thick': 'No' },                                                 COMPONENTS.tableRowHeader);
  COMPONENTS.dataDisplay          = find('GE_Data display',       {},                                                                                                                                                COMPONENTS.dataDisplay);
  COMPONENTS.stackedCard          = find('MD_Stacked card',       { Device: 'Default', Orientation: 'Vertical', Context: 'Full customizable' },                                                                      COMPONENTS.stackedCard);
  COMPONENTS.accordion            = find('GE_Accordion',          {},                                                                                                                                                COMPONENTS.accordion);
  COMPONENTS.stackedCardInfo      = find('MD_Stacked card_info',  { 'Alert state': 'Info' },                                                                                                                         COMPONENTS.stackedCardInfo);
  COMPONENTS.navDrawer            = find('MD_Navigation Drawer',  { Context: 'Standard', Device: 'Desktop', State: 'Open', 'Component state': 'Opened', Deprecated: 'false' },                                     COMPONENTS.navDrawer);
  COMPONENTS.chip                 = find('MD_Chips',              { Size: 'Normal', Version: 'Normal', Style: 'Filled', State: 'Default' },                                                                          COMPONENTS.chip);
  COMPONENTS.tooltip              = find('MD_Plain Tooltip',      {},                                                                                                                                                COMPONENTS.tooltip);
  COMPONENTS.richTooltip          = find('MD_Rich Tooltip',       {},                                                                                                                                                COMPONENTS.richTooltip);
  COMPONENTS.switch               = find('MD_Switch',             { Selected: 'True', 'User interaction': 'None', 'Component state': 'Enabled', 'has Icon active': 'False', 'has Icon inactive': 'False' },         COMPONENTS.switch);
  COMPONENTS.link                 = find('GE_Link',               { State: 'Standard', Type: 'Bold' },                                                                                                               COMPONENTS.link);
  COMPONENTS.dropdown             = find('MD_Menu List Item',     { Style: 'Selection with color', 'User interaction': 'Default', 'Component state': 'Enabled', Selected: 'False', 'has Icon right': 'False', 'has Icon left': 'False', 'has Checkbox left': 'False', 'is Multiselect': 'False' }, COMPONENTS.dropdown);
  COMPONENTS.tabs                 = find('MD_Tabs',               { Device: 'desktop', Display: 'Secondary' },                                                                                                       COMPONENTS.tabs);
  COMPONENTS.captcha              = find('GE_Captcha',            { Context: 'Phase de production', 'Component state': 'Default' },                                                                                  COMPONENTS.captcha);
  COMPONENTS.upload               = find('GE_upload_file',        { Context: 'Browse only' },                                                                                                                        COMPONENTS.upload);
  COMPONENTS.stepper.steps3       = find('GE_Stepper',            { Device: 'Desktop', 'Orientation': 'FullVertical (recommandé)', 'Number of steps': '3' },                                                         COMPONENTS.stepper.steps3);
  COMPONENTS.button.filled        = find('MD_Filled Button',      { 'User interaction': 'None', 'Component state': 'Enabled', Size: 'Small (Default)', Display: 'Round' },                                          COMPONENTS.button.filled);
  COMPONENTS.button.text          = find('MD_Text Button',        { 'User interaction': 'None', 'Component state': 'Enabled' },                                                                                      COMPONENTS.button.text);
}

// Maps slug names (used in ui.html) to live COMPONENTS keys.
// Built at call time so it always reads the post-applyConfig values.
function resolveKey(slug: string): string | null {
  const map: Record<string, string> = {
    accordion:         COMPONENTS.accordion,
    dataDisplay:       COMPONENTS.dataDisplay,
    stackedCard:       COMPONENTS.stackedCard,
    stackedCardInfo:   COMPONENTS.stackedCardInfo,
    separator:         COMPONENTS.separator,
    carousel:          COMPONENTS.carousel,
    quote:             COMPONENTS.quote,
    'stepper.steps3':  COMPONENTS.stepper.steps3,
    'stepper.steps6':  COMPONENTS.stepper.steps6,
    searchinput:       COMPONENTS.searchinput,
    filtersPanel:      COMPONENTS.filtersPanel,
    ensembleFiltres:   COMPONENTS.ensembleFiltres,
    select:            COMPONENTS.select,
    checkbox:          COMPONENTS.checkbox,
    radio:             COMPONENTS.radio,
    textfield:         COMPONENTS.textfield,
    datepicker:        COMPONENTS.datepicker,
    captcha:           COMPONENTS.captcha,
    upload:            COMPONENTS.upload,
    breadcrumb:        COMPONENTS.breadcrumb,
    navDrawer:         COMPONENTS.navDrawer,
    treeView:          COMPONENTS.treeView,
    tabs:              COMPONENTS.tabs,
    h1:                COMPONENTS.typescale.h1_desktop,
    h2:                COMPONENTS.typescale.h2_desktop,
    h3:                COMPONENTS.typescale.h3_desktop,
    h4:                COMPONENTS.typescale.h4_desktop,
    h5:                COMPONENTS.typescale.h5_desktop,
    'button.filled':   COMPONENTS.button.filled,
    'button.outlined': COMPONENTS.button.outlined,
    'button.text':     COMPONENTS.button.text,
    dropdown:          COMPONENTS.dropdown,
    link:              COMPONENTS.link,
    switch:            COMPONENTS.switch,
    chip:              COMPONENTS.chip,
    tooltip:           COMPONENTS.tooltip,
    richTooltip:       COMPONENTS.richTooltip,
    snackbar:          COMPONENTS.snackbar,
    progressBar:       COMPONENTS.progressBar,
  };
  return map[slug] || null;
}

// ── OUVRIR LE PLUGIN ─────────────────────────────────────
figma.showUI(__html__, { width: 300, height: 600, title: 'GE-Design Builder' });

notifySelection();

figma.on('selectionchange', () => {
  notifySelection();
});

function notifySelection(): void {
  const sel = figma.currentPage.selection;
  const hasFrame = sel.length > 0 && sel[0].type === 'FRAME';
  figma.ui.postMessage({
    type: 'selection-change',
    hasFrame,
    frameName: hasFrame ? sel[0].name : null,
  });
}

// ── ÉCOUTER LES MESSAGES DE L'UI ─────────────────────────
figma.ui.onmessage = async (msg: PluginMessage) => {
  try {
    if (msg.type === 'config-loaded') {
      applyConfig(msg.components);
    } else if (msg.type === 'generate-template') {
      await handleGenerateTemplate(msg.templateId, msg.context, msg.sidebarPos);
    } else if (msg.type === 'insert-bloc') {
      await handleInsertBloc(msg.key);
    } else if (msg.type === 'insert-table') {
      await handleInsertTable();
    } else if (msg.type === 'insert-list') {
      await handleInsertList();
    } else if (msg.type === 'insert-surface') {
      await handleInsertSurface(msg.colorKey, msg.paddingKey, msg.withShadow);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    figma.notify('Erreur : ' + message, { error: true });
    figma.ui.postMessage({ type: 'error', message });
  }
};

// ── TEMPLATE RESOLVERS ───────────────────────────────────
function getBackofficeShell() {
  return {
    header:     COMPONENTS.header.default,
    navDrawer:  COMPONENTS.navDrawer,
    breadcrumb: COMPONENTS.breadcrumb,
    title:      COMPONENTS.typescale.h1_desktop,
    footer:     COMPONENTS.footer.default,
  };
}

function resolveBackofficeContentKeys(templateId: TemplateId): string[] {
  if (templateId === 'liste') return [];
  if (templateId === 'formulaire') {
    return [
      COMPONENTS.typescale.h2_desktop,
      COMPONENTS.stepper.steps3,
      COMPONENTS.stackedCard,
      COMPONENTS.button.text,
      COMPONENTS.button.outlined,
      COMPONENTS.button.filled,
    ];
  }
  if (templateId === 'detail') {
    return [
      COMPONENTS.stackedCardInfo,
      COMPONENTS.dataDisplay,
      COMPONENTS.button.text,
      COMPONENTS.button.filled,
    ];
  }
  return [];
}

function resolvePortailContentKeys(templateId: TemplateId): {
  main: string[];
  sidebar: string[];
} {
  if (templateId === 'liste') {
    return {
      main:    [COMPONENTS.filtersPanel, COMPONENTS.tableRow],
      sidebar: [COMPONENTS.stackedCardInfo],
    };
  }
  if (templateId === 'formulaire') {
    return {
      main: [
        COMPONENTS.stepper.steps3,
        COMPONENTS.stackedCard,
        COMPONENTS.button.text,
        COMPONENTS.button.outlined,
        COMPONENTS.button.filled,
      ],
      sidebar: [],
    };
  }
  if (templateId === 'detail') {
    return {
      main:    [COMPONENTS.dataDisplay, COMPONENTS.button.text, COMPONENTS.button.filled],
      sidebar: [COMPONENTS.stackedCardInfo],
    };
  }
  return { main: [], sidebar: [] };
}

// ── FRAME BUILDER ────────────────────────────────────────

/**
 * Crée la frame racine de la page sur le canvas Figma.
 * Largeur fixe 1440px, hauteur en hug (AUTO), fond gris clair.
 */
async function createPageFrame(label: string): Promise<FrameNode> {
  const frame = figma.createFrame();
  frame.name = '[ge-builder] ' + label;
  frame.layoutMode = 'VERTICAL';
  frame.itemSpacing = 0;
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'FIXED';
  frame.resize(1440, 100);
  frame.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.96, b: 0.97 } }];
  const center = figma.viewport.center;
  frame.x = center.x - 720;
  frame.y = center.y - 200;
  return frame;
}

/**
 * Crée la structure de layout back-office avec sidebar fixe à gauche
 * et colonne de contenu à droite.
 */
function createBackofficeSidebarFrame(parent: FrameNode): {
  sidebar: FrameNode;
  breadcrumb: FrameNode;
  content: FrameNode;
} {
  const row = figma.createFrame();
  row.name = 'sidebar + contenu';
  row.layoutMode = 'HORIZONTAL';
  row.itemSpacing = 0;
  row.primaryAxisSizingMode = 'FIXED';
  row.counterAxisSizingMode = 'AUTO';
  row.layoutAlign = 'STRETCH';
  row.fills = [];
  parent.appendChild(row);

  const sidebar = figma.createFrame();
  sidebar.name = 'sidebar';
  sidebar.layoutMode = 'VERTICAL';
  sidebar.resize(300, 100);
  sidebar.primaryAxisSizingMode = 'AUTO';
  sidebar.counterAxisSizingMode = 'FIXED';
  sidebar.layoutAlign = 'STRETCH';
  sidebar.clipsContent = true;
  sidebar.fills = [];
  row.appendChild(sidebar);

  const rightCol = figma.createFrame();
  rightCol.name = 'colonne droite';
  rightCol.layoutMode = 'VERTICAL';
  rightCol.itemSpacing = 0;
  rightCol.layoutGrow = 1;
  rightCol.layoutAlign = 'STRETCH';
  rightCol.primaryAxisSizingMode = 'FIXED';
  rightCol.counterAxisSizingMode = 'FIXED';
  rightCol.fills = [{ type: 'SOLID', color: { r: 0.984, g: 0.988, b: 1 } }];
  row.appendChild(rightCol);

  const breadcrumbZone = figma.createFrame();
  breadcrumbZone.name = 'breadcrumb';
  breadcrumbZone.layoutMode = 'VERTICAL';
  breadcrumbZone.paddingTop = 0;
  breadcrumbZone.paddingBottom = 32;
  breadcrumbZone.paddingLeft = 0;
  breadcrumbZone.paddingRight = 0;
  breadcrumbZone.primaryAxisSizingMode = 'AUTO';
  breadcrumbZone.counterAxisSizingMode = 'FIXED';
  breadcrumbZone.layoutAlign = 'STRETCH';
  breadcrumbZone.fills = [];
  rightCol.appendChild(breadcrumbZone);

  const content = figma.createFrame();
  content.name = 'contenu';
  content.layoutMode = 'VERTICAL';
  content.itemSpacing = 24;
  content.paddingTop = 0;
  content.paddingLeft = 32;
  content.paddingRight = 32;
  content.paddingBottom = 32;
  content.layoutGrow = 0;
  content.primaryAxisSizingMode = 'AUTO';
  content.counterAxisSizingMode = 'FIXED';
  content.primaryAxisAlignItems = 'MIN';
  content.layoutAlign = 'STRETCH';
  content.fills = [];
  rightCol.appendChild(content);

  return { sidebar, breadcrumb: breadcrumbZone, content };
}

/**
 * Crée une frame liste avec 5 items et l'insère dans la frame parente donnée.
 * Le premier item est en état sélectionné (Blue), les suivants en standard (White).
 */
async function buildList(parent: FrameNode): Promise<void> {
  const listFrame = figma.createFrame();
  listFrame.name = 'Liste';
  listFrame.layoutMode = 'VERTICAL';
  listFrame.itemSpacing = 0;
  listFrame.primaryAxisSizingMode = 'AUTO';
  listFrame.counterAxisSizingMode = 'FIXED';
  listFrame.layoutAlign = 'STRETCH';
  listFrame.primaryAxisAlignItems = 'MIN';
  listFrame.fills = [];
  parent.appendChild(listFrame);
  listFrame.clipsContent = false;

  for (let i = 0; i < 5; i++) {
    const itemKey = i === 0 ? COMPONENTS.list.selected : COMPONENTS.list.item;
    const itemComp = await figma.importComponentByKeyAsync(itemKey);
    const itemInst = itemComp.createInstance();
    listFrame.appendChild(itemInst);
    itemInst.layoutAlign = 'STRETCH';
  }
}

// ── COMPONENT INSERTER ───────────────────────────────────

/**
 * Insère tous les composants du template back-office dans la frame racine.
 */
async function insertBackofficeShell(
  frame: FrameNode,
  templateId: TemplateId
): Promise<void> {
  const shell = getBackofficeShell();
  const contentKeys = resolveBackofficeContentKeys(templateId);

  // 1. Header pleine largeur
  const headerComp = await figma.importComponentByKeyAsync(shell.header);
  const headerInst = headerComp.createInstance();
  frame.appendChild(headerInst);
  headerInst.layoutAlign = 'STRETCH';

  // 2. Zone sidebar + colonne de contenu
  const { sidebar, breadcrumb, content } = createBackofficeSidebarFrame(frame);

  // 2a. Navigation drawer (largeur forcée à 300px)
  const navComp = await figma.importComponentByKeyAsync(shell.navDrawer);
  const navInst = navComp.createInstance();
  sidebar.appendChild(navInst);
  navInst.resize(300, navInst.height);
  navInst.layoutAlign = 'INHERIT';
  navInst.layoutGrow = 0;

  // 2b. Breadcrumb
  const bcComp = await figma.importComponentByKeyAsync(shell.breadcrumb);
  const bcInst = bcComp.createInstance();
  breadcrumb.appendChild(bcInst);
  bcInst.layoutAlign = 'STRETCH';

  // 2c. Titre H1
  const titleComp = await figma.importComponentByKeyAsync(shell.title);
  const titleInst = titleComp.createInstance();
  content.appendChild(titleInst);
  titleInst.layoutAlign = 'STRETCH';

  // 2d. Blocs spécifiques au template
  if (templateId === 'liste') {
    const filtersComp = await figma.importComponentByKeyAsync(COMPONENTS.filtersPanel);
    const filtersInst = filtersComp.createInstance();
    content.appendChild(filtersInst);
    filtersInst.layoutAlign = 'STRETCH';
    await buildList(content);
  } else {
    for (let i = 0; i < contentKeys.length; i++) {
      try {
        const comp = await figma.importComponentByKeyAsync(contentKeys[i]);
        const inst = comp.createInstance();
        content.appendChild(inst);
        const isButton =
          contentKeys[i] === COMPONENTS.button.filled ||
          contentKeys[i] === COMPONENTS.button.outlined ||
          contentKeys[i] === COMPONENTS.button.text;
        if (!isButton) inst.layoutAlign = 'STRETCH';
      } catch (err) {
        console.error('[ge-builder] echec backoffice content', contentKeys[i], err);
      }
    }
  }

  // 3. Footer pleine largeur
  const footerComp = await figma.importComponentByKeyAsync(shell.footer);
  const footerInst = footerComp.createInstance();
  frame.appendChild(footerInst);
  footerInst.layoutAlign = 'STRETCH';
}

/**
 * Insère tous les composants du template portail dans la frame racine.
 */
async function insertPortailShell(
  frame: FrameNode,
  templateId: TemplateId,
  sidebarPosition: SidebarPos
): Promise<void> {
  const keys = resolvePortailContentKeys(templateId);

  // 1. Header portal_large pleine largeur
  const headerComp = await figma.importComponentByKeyAsync(COMPONENTS.header.portal_large);
  const headerInst = headerComp.createInstance();
  frame.appendChild(headerInst);
  headerInst.layoutAlign = 'STRETCH';

  // 2. Zone principale blanche centrée à 1140px via padding 150px L/R
  const zone = figma.createFrame();
  zone.name = 'zone principale';
  zone.layoutMode = 'VERTICAL';
  zone.itemSpacing = 0;
  zone.paddingTop = 0;
  zone.paddingBottom = 40;
  zone.paddingLeft = 150;
  zone.paddingRight = 150;
  zone.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  zone.primaryAxisSizingMode = 'AUTO';
  zone.counterAxisSizingMode = 'AUTO';
  zone.layoutAlign = 'STRETCH';
  frame.appendChild(zone);

  // 2a. Breadcrumb sans padding latéral
  const bcComp = await figma.importComponentByKeyAsync(COMPONENTS.breadcrumb);
  const bcInst = bcComp.createInstance();
  zone.appendChild(bcInst);
  bcInst.layoutAlign = 'STRETCH';
  bcInst.paddingLeft = 0;
  bcInst.paddingRight = 0;

  // 2b. Zone de contenu horizontale
  const contentZone = figma.createFrame();
  contentZone.name = 'zone de contenu';
  contentZone.layoutMode = 'HORIZONTAL';
  contentZone.itemSpacing = 24;
  contentZone.paddingTop = 24;
  contentZone.fills = [];
  contentZone.primaryAxisSizingMode = 'FIXED';
  contentZone.counterAxisSizingMode = 'AUTO';
  contentZone.layoutAlign = 'STRETCH';
  zone.appendChild(contentZone);

  // Colonne gauche — fill remaining
  const leftCol = figma.createFrame();
  leftCol.name = 'colonne gauche';
  leftCol.layoutMode = 'VERTICAL';
  leftCol.itemSpacing = 24;
  leftCol.fills = [];
  leftCol.layoutGrow = 1;
  leftCol.layoutAlign = 'STRETCH';
  leftCol.primaryAxisSizingMode = 'FIXED';
  leftCol.counterAxisSizingMode = 'FIXED';
  leftCol.primaryAxisAlignItems = 'MIN';
  contentZone.appendChild(leftCol);

  // Colonne droite — sidebar 360px fixe
  const rightCol = figma.createFrame();
  rightCol.name = 'colonne droite';
  rightCol.layoutMode = 'VERTICAL';
  rightCol.itemSpacing = 24;
  rightCol.fills = [];
  rightCol.resize(360, 100);
  rightCol.primaryAxisSizingMode = 'AUTO';
  rightCol.counterAxisSizingMode = 'FIXED';
  rightCol.layoutAlign = 'STRETCH';
  contentZone.appendChild(rightCol);

  if (sidebarPosition === 'left') contentZone.insertChild(0, rightCol);

  // 2c. Titre H1 — premier élément de la colonne gauche
  const titleComp = await figma.importComponentByKeyAsync(COMPONENTS.typescale.h1_desktop);
  const titleInst = titleComp.createInstance();
  leftCol.appendChild(titleInst);
  titleInst.layoutAlign = 'STRETCH';

  // 2d. Contenu colonne gauche
  if (templateId === 'liste') {
    const filtersComp = await figma.importComponentByKeyAsync(COMPONENTS.filtersPanel);
    const filtersInst = filtersComp.createInstance();
    leftCol.appendChild(filtersInst);
    filtersInst.layoutAlign = 'STRETCH';
    filtersInst.resize(leftCol.width, filtersInst.height);
    await buildList(leftCol);
  } else {
    for (let i = 0; i < keys.main.length; i++) {
      try {
        const comp = await figma.importComponentByKeyAsync(keys.main[i]);
        const inst = comp.createInstance();
        leftCol.appendChild(inst);
        const isButton =
          keys.main[i] === COMPONENTS.button.filled ||
          keys.main[i] === COMPONENTS.button.outlined ||
          keys.main[i] === COMPONENTS.button.text;
        if (!isButton) inst.layoutAlign = 'STRETCH';
        if (
          keys.main[i] === COMPONENTS.filtersPanel ||
          keys.main[i] === COMPONENTS.ensembleFiltres
        ) {
          inst.resize(leftCol.width, inst.height);
        }
      } catch (err) {
        console.error('[portail] echec contenu', i, err);
      }
    }
  }

  // 2e. Sidebar — colonne droite
  for (let i = 0; i < keys.sidebar.length; i++) {
    try {
      const comp = await figma.importComponentByKeyAsync(keys.sidebar[i]);
      const inst = comp.createInstance();
      rightCol.appendChild(inst);
      inst.layoutAlign = 'STRETCH';
    } catch (err) {
      console.error('[portail] echec sidebar', i, err);
    }
  }

  // 3. Footer pleine largeur
  const footerComp = await figma.importComponentByKeyAsync(COMPONENTS.footer.default);
  const footerInst = footerComp.createInstance();
  frame.appendChild(footerInst);
  footerInst.layoutAlign = 'STRETCH';
}

// ── HANDLERS ─────────────────────────────────────────────

/**
 * Génère un template complet sur le canvas.
 */
async function handleGenerateTemplate(
  templateId: TemplateId,
  context: ContextId,
  sidebarPos: SidebarPos
): Promise<void> {
  const labels: Record<TemplateId, string> = {
    liste:      'Liste / Recherche',
    formulaire: 'Formulaire',
    detail:     'Détail',
  };
  const label = labels[templateId];
  const frame = await createPageFrame(label);

  if (context === 'backoffice') {
    await insertBackofficeShell(frame, templateId);
  } else {
    await insertPortailShell(frame, templateId, sidebarPos);
  }

  figma.ui.postMessage({ type: 'generate-done', label });
  figma.notify('Template "' + label + '" généré ✓', {
    timeout: 4000,
    button: {
      text: 'Voir',
      action: () => figma.viewport.scrollAndZoomIntoView([frame]),
    },
  });
}

/**
 * Insère un bloc dans la frame sélectionnée.
 */
async function handleInsertBloc(slug: string): Promise<void> {
  const sel = figma.currentPage.selection;
  if (sel.length === 0 || sel[0].type !== 'FRAME') {
    figma.notify('Sélectionnez une frame cible sur le canvas', { error: true });
    figma.ui.postMessage({ type: 'insert-done' });
    return;
  }
  const target = sel[0] as FrameNode;
  const key = resolveKey(slug) || slug;
  const comp = await figma.importComponentByKeyAsync(key);
  const inst = comp.createInstance();
  target.appendChild(inst);
  inst.layoutAlign = 'STRETCH';
  figma.notify('Bloc ajouté ✓');
  figma.ui.postMessage({ type: 'insert-done' });
}

/**
 * Crée un tableau avec header + 5 lignes zebra striped dans la frame sélectionnée.
 */
async function handleInsertTable(): Promise<void> {
  const sel = figma.currentPage.selection;
  if (sel.length === 0 || sel[0].type !== 'FRAME') {
    figma.notify('Sélectionnez une frame cible sur le canvas', { error: true });
    figma.ui.postMessage({ type: 'insert-done' });
    return;
  }
  const target = sel[0] as FrameNode;

  const tableFrame = figma.createFrame();
  tableFrame.name = 'Tableau';
  tableFrame.layoutMode = 'VERTICAL';
  tableFrame.itemSpacing = 0;
  tableFrame.primaryAxisSizingMode = 'AUTO';
  tableFrame.counterAxisSizingMode = 'FIXED';
  tableFrame.layoutAlign = 'STRETCH';
  tableFrame.fills = [];
  tableFrame.cornerRadius = 4;
  tableFrame.strokes = [{ type: 'SOLID', color: { r: 0.831, g: 0.824, b: 0.812 } }];
  tableFrame.strokeWeight = 1;
  tableFrame.strokeAlign = 'INSIDE';
  target.appendChild(tableFrame);
  tableFrame.clipsContent = true;

  const headerComp = await figma.importComponentByKeyAsync(COMPONENTS.tableRowHeader);
  const headerInst = headerComp.createInstance();
  tableFrame.appendChild(headerInst);
  headerInst.layoutAlign = 'STRETCH';

  for (let i = 0; i < 5; i++) {
    const rowKey = i % 2 === 0 ? COMPONENTS.tableRow : COMPONENTS.tableRowStriped;
    const rowComp = await figma.importComponentByKeyAsync(rowKey);
    const rowInst = rowComp.createInstance();
    tableFrame.appendChild(rowInst);
    rowInst.layoutAlign = 'STRETCH';
  }

  figma.notify('Tableau ajouté ✓');
  figma.ui.postMessage({ type: 'insert-done' });
}

/**
 * Crée une liste de 5 items dans la frame sélectionnée.
 */
async function handleInsertList(): Promise<void> {
  const sel = figma.currentPage.selection;
  if (sel.length === 0 || sel[0].type !== 'FRAME') {
    figma.notify('Sélectionnez une frame cible sur le canvas', { error: true });
    figma.ui.postMessage({ type: 'insert-done' });
    return;
  }
  await buildList(sel[0] as FrameNode);
  figma.notify('Liste ajoutée ✓');
  figma.ui.postMessage({ type: 'insert-done' });
}

/**
 * Crée une surface avec couleur, padding et ombre configurables dans la frame sélectionnée.
 */
async function handleInsertSurface(
  colorKey: string,
  paddingKey: string,
  withShadow: boolean
): Promise<void> {
  const sel = figma.currentPage.selection;
  if (sel.length === 0 || sel[0].type !== 'FRAME') {
    figma.notify('Sélectionnez une frame cible sur le canvas', { error: true });
    figma.ui.postMessage({ type: 'insert-done' });
    return;
  }
  const target = sel[0] as FrameNode;

  const colors: Record<string, RGB> = {
    background: { r: 1,     g: 1,     b: 1     },
    lowest:     { r: 0.969, g: 0.980, b: 0.988 },
    low:        { r: 0.902, g: 0.941, b: 0.969 },
    high:       { r: 0.902, g: 0.945, b: 0.980 },
    highest:    { r: 0.835, g: 0.894, b: 0.941 },
  };
  const paddings: Record<string, number> = {
    '2xl': 32, 'xl': 24, 'md': 16, 'xs': 8, 'none': 0,
  };

  const color = colors[colorKey];
  const padding = paddings[paddingKey];

  const surface = figma.createFrame();
  surface.name = 'Surface ' + colorKey + ' — ' + paddingKey;
  surface.layoutMode = 'VERTICAL';
  surface.itemSpacing = 16;
  surface.paddingTop = padding;
  surface.paddingBottom = padding;
  surface.paddingLeft = padding;
  surface.paddingRight = padding;
  surface.primaryAxisSizingMode = 'AUTO';
  surface.counterAxisSizingMode = 'FIXED';
  surface.layoutAlign = 'STRETCH';
  surface.cornerRadius = 12;
  surface.primaryAxisAlignItems = 'MIN';
  surface.fills = [{ type: 'SOLID', color }];

  if (withShadow) {
    surface.effects = [
      {
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0.2, b: 0.333, a: 0.15 },
        offset: { x: 0, y: 1 },
        radius: 3,
        spread: 0,
        visible: true,
        blendMode: 'NORMAL',
      },
      {
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0.2, b: 0.333, a: 0.30 },
        offset: { x: 0, y: 1 },
        radius: 2,
        spread: -1,
        visible: true,
        blendMode: 'NORMAL',
      },
    ];
  }

  surface.clipsContent = false;
  target.appendChild(surface);
  figma.notify('Surface ajoutée ✓');
  figma.ui.postMessage({ type: 'insert-done' });
}