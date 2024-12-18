interface Theme {
  name: string;
  properties: any;
}

const Colours = {
  '_1': '#e4e4e4',
  '_2': '#efefee',
  '_3': '#ffffff',
  '_4': '#339',
  '_5': '#212529',
  '_6': '#333',
  '_7': '#20242c',
  '_8': '#2c3241',
  '_9': '#ebf2f6',
  '_10': '#b6dcf6',
  '_11': '#f1f1f1',
  '_12': '#272777',
  '_13': '#b5dbf5',
  '_14': '#eaeaea',
  '_15': '#d10000',
  '_16': '#a7b1be',
  '_17': '#bce1bc',
  '_18': '#ffff99',
  '_19': '#ff9999',
  '_20': '#525865',
  '_21': '#e39d9f',
  '_22': '#db2280',
  '_23': '#4D4D4D',
  '_24': '#008538',
  '_25': '#C1130B',
  '_26': '#d8d7f9',
  '_27': '#e1e8ec',
  '_28': '#dcdcdb',
  '_29': '#999999',
  '_30': '#4D4D4D',
  '_31': '#5c5cad'
};

const light: Theme = {
  name: 'light',
  properties: {
    // GLOBAL
    '--background': Colours._1,
    '--go-to-top-background': Colours._4,
    '--go-to-top-icon': Colours._3,
    '--breadcrumbs-text': Colours._4,
    '--breadcrumbs-text2': Colours._6,

    // HEADER
    '--top-header-background': Colours._1,
    '--top-header-icon-color': Colours._4,
    '--top-header-text': Colours._6,
    '--top-header-links': Colours._4,
    '--header-background': Colours._2,
    '--header-title': Colours._4,
    '--header-text': Colours._6,
    '--home-header-background': Colours._1,

    // FOOTER
    '--footer-background': Colours._11,
    '--footer-text': Colours._6,
    '--footer-link-text': Colours._4,

    // HOME PAGE
    '--first-half-background': Colours._3,
    '--home-tabs-text': Colours._4,
    '--home-tabs-border': Colours._28,
    '--home-tabs-active-text': Colours._6,
    '--home-tabs-active-border': Colours._4,
    '--home-tabs-button-text': Colours._3,
    '--home-tabs-button-background': Colours._4,
    '--home-4all-background': Colours._26,
    '--home-4all-text': Colours._6,
    '--home-top5-background': Colours._2,
    '--home-top5-text': Colours._6,
    '--home-top5-list-text': Colours._4,
    '--home-numbers-text': Colours._6,
    '--home-header-text-2': Colours._6,

    // DIRECTORIES PAGE
    '--info-observatory-background': Colours._4,
    '--info-observatory-text': Colours._3,
    '--info-title': Colours._6,
    '--info-subtitle': Colours._4,

    // STATISTICS
    '--statistics-background': Colours._3,
    '--statistics-header-background': Colours._2,
    '--statistics-header2-background': Colours._6,
    '--statistics-header2-text': Colours._3,
    '--statistics-text': Colours._6,
    '--statistics-text2': Colours._23,
    '--statistics-button-background1': Colours._4,
    '--statistics-button-background2': Colours._24,
    '--statistics-button-background3': Colours._25,
    '--statistics-button-text': Colours._3,
    '--statistics-border': Colours._21,
    '--statistics-tabs-text': Colours._4,
    '--statistics-score-table-header-background': Colours._6,
    '--statistics-score-table-header-text': Colours._3,
    '--statistics-score-table-text': Colours._6,
    '--statistics-score-table-border': Colours._6,
    '--statistics-score-line': Colours._4,
    '--statistics-practices-titles': Colours._6,
    '--statistics-close': Colours._4,
    '--statistics-close-text': Colours._3,

    // TABLE
    '--table-title': Colours._6,
    '--table-subtitle': Colours._23,
    '--table-header1': Colours._6,
    '--table-header2': Colours._23,
    '--table-header-text': Colours._3,
    '--table-text': Colours._6,
    '--table-hover': Colours._11,
    '--table-directory-name': Colours._4,
    '--table-border': Colours._6,
    '--table-pagination-text': Colours._6,
    '--table-pagination-button-background': Colours._1,
    '--table-pagination-button-text': Colours._6,
    '--table-pagination-select-background': Colours._3,
    '--table-pagination-select-text': Colours._6,
    '--table-pagination-select-border': Colours._4,

    '--home-content-tabs-background': Colours._14,
    '--home-content-tabs-text': Colours._4,


    // RESULTS PAGE
    '--results-header-background': Colours._2,
    '--results-header-text': Colours._4,
    '--results-header-button-background': Colours._4,
    '--results-header-button-border': Colours._4,
    '--results-header-button-text': Colours._11,

    '--results-breadcrumbs-link': Colours._4,
    '--results-breadcrumbs-text': Colours._7,
    '--results-breadcrumbs-header': Colours._30,
    '--results-listbox-background': Colours._1,
    '--results-listbox-background-border': Colours._2,

    '--results-info-accessMonitor-background': Colours._4,
    '--results-info-accessMonitor-text': Colours._3,
    '--results-info-url': Colours._6,
    '--results-info-title': Colours._6,

    '--results-action-button-background': Colours._3,
    '--results-action-button-text': Colours._4,
    '--results-action-menu-background': Colours._31,

    '--results-summary-background': Colours._3,
    '--results-summary-text': Colours._6,
    '--results-summary-table-background': Colours._2,
    '--results-summary-table-text': Colours._6,
    '--results-summary-table-border': Colours._3,
    '--results-summary-table-border2': Colours._6,
    '--results-summary-table-border3': Colours._29,

    '--results-evaluation-background': Colours._3,
    '--results-evaluation-title': Colours._6,
    '--results-evaluation-table-border': Colours._6,
    '--results-evaluation-table-head-background': Colours._6,
    '--results-evaluation-table-head-text': Colours._3,
    '--results-evaluation-table-body-background': Colours._3,
    '--results-evaluation-table-body-collapsible-background': Colours._11,
    '--results-evaluation-table-body-text': Colours._6,
    '--results-evaluation-table-body-icon': Colours._4,
    '--results-evaluation-table-arrow': Colours._4,

    // ELEMENTS RESULTS
    '--elements-test-description-background': Colours._3,
    '--elements-test-description-text': Colours._6,
    '--elements-test-description-border': Colours._1,
    '--elements-tabs-text': Colours._4,
    '--elements-list-background': Colours._3,
    '--elements-list-border': Colours._6,
    '--elements-list-text': Colours._6,
    '--elements-list-label-background': Colours._11,
    '--elements-list-code': Colours._22,

    // WEBPAGE CODE
    '--webpage-code-background': Colours._3,
    '--webpage-code-text': Colours._6,
  }
};

const dark: Theme = {
  name: 'dark',
  properties: {
    // GLOBAL
    '--background': Colours._7,
    '--go-to-top-background': Colours._10,
    '--go-to-top-icon': Colours._7,
    '--breadcrumbs-text': Colours._10,
    '--breadcrumbs-text2': Colours._10,
    '--home-content-background': Colours._8,

    // HEADER
    '--top-header-background': Colours._12,
    '--top-header-icon-color': Colours._13,
    '--top-header-text': Colours._10,
    '--top-header-links': Colours._10,
    '--header-background': Colours._4,
    '--header-title': Colours._13,
    '--header-text': Colours._9,
    '--home-header-background': Colours._4,

    // FOOTER
    '--footer-background': Colours._12,
    '--footer-text': Colours._13,
    '--footer-link-text': Colours._13,

    // HOME PAGE
    '--first-half-background': Colours._8,
    '--home-tabs-text': Colours._9,
    '--home-tabs-border': Colours._23,
    '--home-tabs-active-text': Colours._9,
    '--home-tabs-active-border': Colours._9,
    '--home-tabs-button-text': Colours._7,
    '--home-tabs-button-background': Colours._10,
    '--home-4all-background': Colours._4,
    '--home-4all-text': Colours._27,
    '--home-top5-background': Colours._7,
    '--home-top5-text': Colours._27,
    '--home-top5-list-text': Colours._10,
    '--home-numbers-text': Colours._27,
    '--home-header-text-2': Colours._9,

    // DIRECTORIES PAGE
    '--info-observatory-background': Colours._10,
    '--info-observatory-text': Colours._7,
    '--info-title': Colours._9,
    '--info-subtitle': Colours._10,

    // STATISTICS
    '--statistics-background': Colours._8,
    '--statistics-header-background': Colours._7,
    '--statistics-header2-background': Colours._7,
    '--statistics-header2-text': Colours._9,
    '--statistics-text': Colours._9,
    '--statistics-text2': Colours._9,
    '--statistics-button-background1': Colours._4,
    '--statistics-button-background2': Colours._24,
    '--statistics-button-background3': Colours._25,
    '--statistics-button-text': Colours._10,
    '--statistics-border': Colours._23,
    '--statistics-tabs-text': Colours._10,
    '--statistics-score-table-header-background': Colours._6,
    '--statistics-score-table-header-text': Colours._3,
    '--statistics-score-table-text': Colours._3,
    '--statistics-score-table-border': Colours._23,
    '--statistics-score-line': Colours._10,
    '--statistics-practices-titles': Colours._9,
    '--statistics-close': Colours._10,
    '--statistics-close-text': Colours._8,

    // TABLE
    '--table-title': Colours._9,
    '--table-subtitle': Colours._9,
    '--table-header1': Colours._6,
    '--table-header2': Colours._23,
    '--table-header-text': Colours._9,
    '--table-text': Colours._3,
    '--table-hover': Colours._7,
    '--table-directory-name': Colours._3,
    '--table-border': Colours._20,
    '--table-pagination-text': Colours._9,
    '--table-pagination-button-background': Colours._10,
    '--table-pagination-button-text': Colours._4,
    '--table-pagination-select-background': Colours._8,
    '--table-pagination-select-text': Colours._9,
    '--table-pagination-select-border': Colours._10,

    '--home-content-tabs-background': Colours._7,
    '--home-content-tabs-text': Colours._10,

    // RESULTS PAGE
    '--results-header-background': Colours._4,
    '--results-header-text': Colours._13,
    '--results-header-button-background': Colours._10,
    '--results-header-button-border': Colours._10,
    '--results-header-button-text': Colours._6,

    '--results-breadcrumbs-link': Colours._10,
    '--results-breadcrumbs-text': Colours._10,
    '--results-breadcrumbs-header': Colours._1,
    '--results-listbox-background': Colours._7,
    '--results-listbox-background-border': Colours._4,

    '--results-info-accessMonitor-background': Colours._10,
    '--results-info-accessMonitor-text': Colours._7,
    '--results-info-url': Colours._9,
    '--results-info-title': Colours._9,

    '--results-action-button-background': Colours._8,
    '--results-action-button-text': Colours._10,
    '--results-action-menu-background': Colours._31,

    '--results-summary-background': Colours._8,
    '--results-summary-text': Colours._9,
    '--results-summary-table-background': Colours._16,
    '--results-summary-table-text': Colours._7,
    '--results-summary-table-border': Colours._7,
    '--results-summary-table-border2': Colours._20,

    '--results-evaluation-background': Colours._8,
    '--results-evaluation-title': Colours._9,
    '--results-evaluation-table-border': Colours._20,
    '--results-evaluation-table-head-background': Colours._7,
    '--results-evaluation-table-head-text': Colours._9,
    '--results-evaluation-table-body-background': Colours._8,
    '--results-evaluation-table-body-collapsible-background': Colours._7,
    '--results-evaluation-table-body-text': Colours._9,
    '--results-evaluation-table-body-icon': Colours._10,
    '--results-evaluation-table-arrow': Colours._10,

    // ELEMENTS RESULTS
    '--elements-test-description-background': Colours._8,
    '--elements-test-description-text': Colours._9,
    '--elements-test-description-border': Colours._20,
    '--elements-tabs-text': Colours._10,
    '--elements-list-background': Colours._8,
    '--elements-list-border': Colours._20,
    '--elements-list-text': Colours._9,
    '--elements-list-label-background': Colours._7,
    '--elements-list-code': Colours._21,

    // WEBPAGE CODE
    '--webpage-code-background': Colours._8,
    '--webpage-code-text': Colours._9,
  }
};

export {
  Theme,
  Colours,
  light,
  dark
};