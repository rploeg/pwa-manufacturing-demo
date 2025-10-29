// Internationalization (i18n) Service
// Supports English, Dutch, and German

export type SupportedLanguage = 'en' | 'nl' | 'de';

interface Translations {
  [key: string]: {
    en: string;
    nl: string;
    de: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', nl: 'Home', de: 'Startseite' },
  'nav.agents': { en: 'Agents', nl: 'Agenten', de: 'Agenten' },
  'nav.digitalTwin': { en: 'Digital Twin', nl: 'Digitale Tweeling', de: 'Digitaler Zwilling' },
  'nav.quality': { en: 'Quality', nl: 'Kwaliteit', de: 'Qualität' },
  'nav.maintenance': { en: 'Maintenance', nl: 'Onderhoud', de: 'Wartung' },
  'nav.energy': { en: 'Energy', nl: 'Energie', de: 'Energie' },
  'nav.performance': { en: 'Performance', nl: 'Prestaties', de: 'Leistung' },
  'nav.shiftHandover': { en: 'Shift Handover', nl: 'Dienst Overdracht', de: 'Schichtübergabe' },
  'nav.rootCause': { en: 'Root Cause', nl: 'Grondoorzaak', de: 'Ursachenanalyse' },
  'nav.traceability': { en: 'Traceability', nl: 'Traceerbaarheid', de: 'Rückverfolgbarkeit' },
  'nav.skillsMatrix': { en: 'Skills Matrix', nl: 'Vaardigheden Matrix', de: 'Kompetenzmatrix' },
  'nav.tools': { en: 'Tools', nl: 'Gereedschap', de: 'Werkzeuge' },
  'nav.workInstructions': {
    en: 'Work Instructions',
    nl: 'Werkinstructies',
    de: 'Arbeitsanweisungen',
  },
  'nav.predictive': { en: 'Predictive', nl: 'Voorspellend', de: 'Vorhersagend' },
  'nav.knowledge': { en: 'Knowledge', nl: 'Kennis', de: 'Wissen' },
  'nav.changeover': { en: 'Changeover', nl: 'Omstelling', de: 'Umrüstung' },
  'nav.safety': { en: 'Safety', nl: 'Veiligheid', de: 'Sicherheit' },
  'nav.oeeCoaching': { en: 'OEE Coaching', nl: 'OEE Coaching', de: 'OEE Coaching' },
  'nav.planning': { en: 'Planning', nl: 'Planning', de: 'Planung' },
  'nav.edgeDevices': { en: 'Edge Devices', nl: 'Edge Apparaten', de: 'Edge-Geräte' },
  'nav.optimization': { en: 'AI Optimization', nl: 'AI Optimalisatie', de: 'KI-Optimierung' },
  'nav.yieldPrediction': {
    en: 'Yield Prediction',
    nl: 'Opbrengstvoorspelling',
    de: 'Ertragsvorhersage',
  },
  'nav.maintenanceCost': {
    en: 'Cost Optimization',
    nl: 'Kostenoptimalisatie',
    de: 'Kostenoptimierung',
  },
  'nav.lineBalancing': {
    en: 'Line Balancing',
    nl: 'Lijnbalancering',
    de: 'Linienausgleich',
  },
  'nav.aiScenarios': { en: 'AI Scenarios', nl: "AI Scenario's", de: 'KI-Szenarien' },
  'nav.settings': { en: 'Settings', nl: 'Instellingen', de: 'Einstellungen' },

  // Navigation Groups
  'nav.group.operations': { en: 'Operations', nl: 'Operaties', de: 'Betrieb' },
  'nav.group.production': { en: 'Production', nl: 'Productie', de: 'Produktion' },
  'nav.group.maintenance': { en: 'Maintenance', nl: 'Onderhoud', de: 'Wartung' },
  'nav.group.performance': { en: 'Performance', nl: 'Prestaties', de: 'Leistung' },
  'nav.group.people': { en: 'People', nl: 'Personeel', de: 'Personal' },
  'nav.group.ai': { en: 'AI & Insights', nl: 'AI & Inzichten', de: 'KI & Erkenntnisse' },
  'nav.group.system': { en: 'System', nl: 'Systeem', de: 'System' },

  // Common
  'common.search': { en: 'Search', nl: 'Zoeken', de: 'Suche' },
  'common.save': { en: 'Save', nl: 'Opslaan', de: 'Speichern' },
  'common.cancel': { en: 'Cancel', nl: 'Annuleren', de: 'Abbrechen' },
  'common.delete': { en: 'Delete', nl: 'Verwijderen', de: 'Löschen' },
  'common.edit': { en: 'Edit', nl: 'Bewerken', de: 'Bearbeiten' },
  'common.close': { en: 'Close', nl: 'Sluiten', de: 'Schließen' },
  'common.open': { en: 'Open', nl: 'Open', de: 'Öffnen' },
  'common.loading': { en: 'Loading...', nl: 'Laden...', de: 'Lädt...' },
  'common.error': { en: 'Error', nl: 'Fout', de: 'Fehler' },
  'common.success': { en: 'Success', nl: 'Geslaagd', de: 'Erfolg' },
  'common.warning': { en: 'Warning', nl: 'Waarschuwing', de: 'Warnung' },
  'common.info': { en: 'Info', nl: 'Info', de: 'Info' },

  // Roles
  'role.frontline': {
    en: 'Frontline Worker',
    nl: 'Uitvoerende Medewerker',
    de: 'Frontline-Mitarbeiter',
  },
  'role.factory-manager': { en: 'Factory Manager', nl: 'Fabriekmanager', de: 'Werksleiter' },
  'role.ot-engineer': { en: 'OT Engineer', nl: 'OT Engineer', de: 'OT-Ingenieur' },
  'role.it-engineer': { en: 'IT Engineer', nl: 'IT Engineer', de: 'IT-Ingenieur' },

  // Dashboard
  'dashboard.title': { en: 'Dashboard', nl: 'Dashboard', de: 'Dashboard' },
  'dashboard.overview': { en: 'Overview', nl: 'Overzicht', de: 'Übersicht' },
  'dashboard.today': { en: 'Today', nl: 'Vandaag', de: 'Heute' },
  'dashboard.thisWeek': { en: 'This Week', nl: 'Deze Week', de: 'Diese Woche' },
  'dashboard.thisMonth': { en: 'This Month', nl: 'Deze Maand', de: 'Dieser Monat' },

  // Energy
  'energy.title': { en: 'Energy Management', nl: 'Energie Beheer', de: 'Energiemanagement' },
  'energy.description': {
    en: 'Monitor power consumption and sustainability metrics',
    nl: 'Monitor energieverbruik en duurzaamheidsstatistieken',
    de: 'Überwachen Sie Stromverbrauch und Nachhaltigkeitskennzahlen',
  },
  'energy.totalPower': { en: 'Total Power', nl: 'Totaal Vermogen', de: 'Gesamtleistung' },
  'energy.realtime': {
    en: 'Real-time consumption',
    nl: 'Real-time verbruik',
    de: 'Echtzeit-Verbrauch',
  },
  'energy.consumption': { en: 'Consumption', nl: 'Verbruik', de: 'Verbrauch' },
  'energy.efficiency': { en: 'Efficiency', nl: 'Efficiëntie', de: 'Effizienz' },
  'energy.savings': { en: 'Cost Savings', nl: 'Kostenbesparing', de: 'Kosteneinsparungen' },
  'energy.co2Saved': { en: 'CO₂ Saved', nl: 'CO₂ Bespaard', de: 'CO₂ Gespart' },

  // Performance
  'performance.title': {
    en: 'Performance Dashboard',
    nl: 'Prestaties Dashboard',
    de: 'Leistungs-Dashboard',
  },
  'performance.kpis': {
    en: 'Key Performance Indicators',
    nl: 'Prestatie-indicatoren',
    de: 'Leistungskennzahlen',
  },
  'performance.achievements': { en: 'Achievements', nl: 'Prestaties', de: 'Erfolge' },
  'performance.leaderboard': { en: 'Leaderboard', nl: 'Klassement', de: 'Bestenliste' },

  // Quality
  'quality.defectRate': { en: 'Defect Rate', nl: 'Defect Percentage', de: 'Fehlerquote' },
  'quality.inspections': { en: 'Inspections', nl: 'Inspecties', de: 'Inspektionen' },
  'quality.passed': { en: 'Passed', nl: 'Geslaagd', de: 'Bestanden' },
  'quality.failed': { en: 'Failed', nl: 'Mislukt', de: 'Fehlgeschlagen' },

  // Production
  'production.line': { en: 'Production Line', nl: 'Productielijn', de: 'Produktionslinie' },
  'production.output': { en: 'Output', nl: 'Output', de: 'Leistung' },
  'production.target': { en: 'Target', nl: 'Doel', de: 'Ziel' },
  'production.downtime': { en: 'Downtime', nl: 'Stilstand', de: 'Ausfallzeit' },
  'production.oee': { en: 'OEE', nl: 'OEE', de: 'OEE' },

  // Maintenance
  'maintenance.scheduled': { en: 'Scheduled', nl: 'Gepland', de: 'Geplant' },
  'maintenance.completed': { en: 'Completed', nl: 'Voltooid', de: 'Abgeschlossen' },
  'maintenance.pending': { en: 'Pending', nl: 'In behandeling', de: 'Ausstehend' },
  'maintenance.overdue': { en: 'Overdue', nl: 'Achterstallig', de: 'Überfällig' },

  // Status
  'status.active': { en: 'Active', nl: 'Actief', de: 'Aktiv' },
  'status.inactive': { en: 'Inactive', nl: 'Inactief', de: 'Inaktiv' },
  'status.running': { en: 'Running', nl: 'Actief', de: 'Läuft' },
  'status.stopped': { en: 'Stopped', nl: 'Gestopt', de: 'Angehalten' },
  'status.critical': { en: 'Critical', nl: 'Kritiek', de: 'Kritisch' },
  'status.warning': { en: 'Warning', nl: 'Waarschuwing', de: 'Warnung' },
  'status.normal': { en: 'Normal', nl: 'Normaal', de: 'Normal' },
  'status.planned': { en: 'Planned', nl: 'Gepland', de: 'Geplant' },
  'status.onTarget': { en: 'On target', nl: 'Op schema', de: 'Auf Ziel' },
  'status.belowThreshold': { en: 'Below threshold', nl: 'Onder drempel', de: 'Unter Schwelle' },

  // Time
  'time.now': { en: 'Now', nl: 'Nu', de: 'Jetzt' },
  'time.today': { en: 'Today', nl: 'Vandaag', de: 'Heute' },
  'time.yesterday': { en: 'Yesterday', nl: 'Gisteren', de: 'Gestern' },
  'time.thisWeek': { en: 'This Week', nl: 'Deze Week', de: 'Diese Woche' },
  'time.lastWeek': { en: 'Last Week', nl: 'Vorige Week', de: 'Letzte Woche' },
  'time.thisMonth': { en: 'This Month', nl: 'Deze Maand', de: 'Dieser Monat' },
  'time.lastMonth': { en: 'Last Month', nl: 'Vorige Maand', de: 'Letzter Monat' },

  // SAP Integration
  'sap.title': { en: 'SAP/ERP Integration', nl: 'SAP/ERP Integratie', de: 'SAP/ERP Integration' },
  'sap.description': {
    en: 'Enterprise resource planning system connectivity',
    nl: 'Enterprise resource planning systeem connectiviteit',
    de: 'Enterprise Resource Planning Systemkonnektivität',
  },
  'sap.connectionStatus': {
    en: 'System Connection Status',
    nl: 'Systeem Verbindingsstatus',
    de: 'Systemverbindungsstatus',
  },
  'sap.status': { en: 'Status', nl: 'Status', de: 'Status' },
  'sap.connected': { en: 'Connected', nl: 'Verbonden', de: 'Verbunden' },
  'sap.disconnected': { en: 'Disconnected', nl: 'Niet Verbonden', de: 'Getrennt' },
  'sap.systemVersion': { en: 'System Version', nl: 'Systeemversie', de: 'Systemversion' },
  'sap.latency': { en: 'Latency', nl: 'Latentie', de: 'Latenz' },
  'sap.dataQuality': { en: 'Data Quality', nl: 'Datakwaliteit', de: 'Datenqualität' },
  'sap.lastSync': { en: 'Last Sync', nl: 'Laatste Sync', de: 'Letzte Synchronisation' },
  'sap.activeOrders': { en: 'Active Orders', nl: 'Actieve Orders', de: 'Aktive Aufträge' },
  'sap.completedToday': {
    en: 'Completed Today',
    nl: 'Vandaag Voltooid',
    de: 'Heute Abgeschlossen',
  },
  'sap.inventoryValue': { en: 'Inventory Value', nl: 'Voorraadwaarde', de: 'Lagerwert' },
  'sap.reorderAlerts': {
    en: 'Reorder Alerts',
    nl: 'Herbeste Waarschuwingen',
    de: 'Nachbestellungswarnungen',
  },
  'sap.workOrders': {
    en: 'Production Work Orders',
    nl: 'Productie Werkorders',
    de: 'Produktionsarbeitsaufträge',
  },
  'sap.materialInventory': {
    en: 'Material Inventory',
    nl: 'Materiaalvoorraad',
    de: 'Materialbestand',
  },
  'sap.refreshData': { en: 'Refresh Data', nl: 'Ververs Data', de: 'Daten Aktualisieren' },
  'sap.materials': { en: 'materials', nl: 'materialen', de: 'Materialien' },
  'sap.activeAndPlanned': {
    en: 'Active and planned manufacturing orders',
    nl: 'Actieve en geplande productieorders',
    de: 'Aktive und geplante Fertigungsaufträge',
  },

  // Predictive Scenarios
  'scenarios.title': {
    en: 'Predictive Scenarios',
    nl: "Voorspellende Scenario's",
    de: 'Vorhersageszenarien',
  },
  'scenarios.description': {
    en: 'What-if analysis and capacity planning calculator',
    nl: 'Wat-als analyse en capaciteitsplanning calculator',
    de: 'Was-wäre-wenn-Analyse und Kapazitätsplanungsrechner',
  },
  'scenarios.parameters': {
    en: 'Scenario Parameters',
    nl: 'Scenario Parameters',
    de: 'Szenarioparameter',
  },
  'scenarios.adjust': {
    en: 'Adjust parameters to see predicted outcomes',
    nl: 'Pas parameters aan om voorspelde resultaten te zien',
    de: 'Parameter anpassen, um vorhergesagte Ergebnisse zu sehen',
  },
  'scenarios.productionRate': {
    en: 'Production Rate',
    nl: 'Productie Snelheid',
    de: 'Produktionsrate',
  },
  'scenarios.shiftsPerDay': {
    en: 'Shifts per Day',
    nl: 'Diensten per Dag',
    de: 'Schichten pro Tag',
  },
  'scenarios.operatorsPerShift': {
    en: 'Operators per Shift',
    nl: 'Operators per Dienst',
    de: 'Bediener pro Schicht',
  },
  'scenarios.defectRate': { en: 'Defect Rate', nl: 'Defect Percentage', de: 'Fehlerquote' },
  'scenarios.powerConsumption': {
    en: 'Power Consumption',
    nl: 'Stroomverbruik',
    de: 'Stromverbrauch',
  },
  'scenarios.energyCost': { en: 'Energy Cost', nl: 'Energiekosten', de: 'Energiekosten' },
  'scenarios.resetBaseline': {
    en: 'Reset to Baseline',
    nl: 'Reset naar Basis',
    de: 'Auf Basis zurücksetzen',
  },
  'scenarios.monthlyOutput': {
    en: 'Monthly Output',
    nl: 'Maandelijkse Output',
    de: 'Monatliche Produktion',
  },
  'scenarios.costPerUnit': {
    en: 'Cost per Unit',
    nl: 'Kosten per Eenheid',
    de: 'Kosten pro Einheit',
  },
  'scenarios.roi': { en: 'ROI', nl: 'ROI', de: 'ROI' },
  'scenarios.costBreakdown': {
    en: 'Cost Breakdown (Monthly)',
    nl: 'Kostenverdeling (Maandelijks)',
    de: 'Kostenaufschlüsselung (Monatlich)',
  },
  'scenarios.energyCostLabel': { en: 'Energy Cost', nl: 'Energiekosten', de: 'Energiekosten' },
  'scenarios.laborCost': { en: 'Labor Cost', nl: 'Arbeidskosten', de: 'Arbeitskosten' },
  'scenarios.qualityCost': {
    en: 'Quality Cost (Defects)',
    nl: 'Kwaliteitskosten (Defecten)',
    de: 'Qualitätskosten (Fehler)',
  },
  'scenarios.totalMonthlyCost': {
    en: 'Total Monthly Cost',
    nl: 'Totale Maandelijkse Kosten',
    de: 'Gesamte Monatskosten',
  },
  'scenarios.recommendations': {
    en: 'AI Recommendations',
    nl: 'AI Aanbevelingen',
    de: 'KI-Empfehlungen',
  },

  // Home/Dashboard
  'home.welcome': { en: 'Welcome', nl: 'Welkom', de: 'Willkommen' },
  'home.overview': { en: 'Overview', nl: 'Overzicht', de: 'Übersicht' },
  'home.quickActions': { en: 'Quick Actions', nl: 'Snelle Acties', de: 'Schnellaktionen' },
  'home.recentAlerts': {
    en: 'Recent Alerts',
    nl: 'Recente Waarschuwingen',
    de: 'Neueste Warnungen',
  },
  'home.systemStatus': { en: 'System Status', nl: 'Systeem Status', de: 'Systemstatus' },
};

class I18nService {
  private currentLanguage: SupportedLanguage = 'en';

  setLanguage(lang: SupportedLanguage) {
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);

    // Update document language attribute
    document.documentElement.lang = lang;
  }

  getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }
  loadLanguage(): SupportedLanguage {
    const saved = localStorage.getItem('language') as SupportedLanguage;
    if (saved && ['en', 'nl', 'de'].includes(saved)) {
      this.currentLanguage = saved;
      document.documentElement.lang = saved;
      return saved;
    }
    return 'en';
  }

  t(key: string, fallback?: string): string {
    const translation = translations[key];
    if (translation) {
      return translation[this.currentLanguage];
    }
    return fallback || key;
  }

  // Format number based on locale
  formatNumber(value: number, decimals: number = 2): string {
    const locale =
      this.currentLanguage === 'nl' ? 'nl-NL' : this.currentLanguage === 'de' ? 'de-DE' : 'en-US';
    return value.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  // Format currency
  formatCurrency(value: number): string {
    const locale =
      this.currentLanguage === 'nl' ? 'nl-NL' : this.currentLanguage === 'de' ? 'de-DE' : 'en-US';
    return value.toLocaleString(locale, {
      style: 'currency',
      currency: 'EUR',
    });
  }

  // Format date
  formatDate(date: Date): string {
    const locale =
      this.currentLanguage === 'nl' ? 'nl-NL' : this.currentLanguage === 'de' ? 'de-DE' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Format time
  formatTime(date: Date): string {
    const locale =
      this.currentLanguage === 'nl' ? 'nl-NL' : this.currentLanguage === 'de' ? 'de-DE' : 'en-US';
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

export const i18nService = new I18nService();
// Load saved language on initialization
i18nService.loadLanguage();
