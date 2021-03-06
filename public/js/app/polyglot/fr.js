'use strict';

define([], function () {
    return {
        'loader.default-text': 'Chargement',
        'main-menu-panel.button.calendar': 'Calendrier',
        'main-menu-panel.button.planner': 'Plan de culture',
        'main-menu-panel.button.entity': 'Ferme',
        'main-menu-panel.button.crops': 'Cultures',
        'main-menu-panel.button.outputs': 'Récoltes',
        'main-menu-panel.button.suppliers': 'Fournisseurs',
        'main-menu-panel.button.clients': 'Clients',
        'main-menu-panel.button.logout': 'Déconnexion',

        // Error
        'error.not_allowed': 'Accès refusé',
        'error.invalid_response': 'Erreur réseau',
        'error.timeout': 'Site distant non joingnable',

        // Page
        'authentication-page.title': 'Fermes',
        'article-page.title': 'Article',
        'article-page.variety-table.title': 'Plantes / Variétés',
        'articles-page.title': 'Articles',
        'block-page.bed-table.title': 'Planches',
        'calendar-page.title': 'S%{week} - %{month} %{year}',
        'calendar-page.task-creation-production.button': 'Tâche de production',
        'calendar-page.task-creation-observation.button': 'Tâche d\'observation',
        'calendar-page.task-creation-post-production.button': 'Tâche de post-production',
        'clients-page.title': 'Clients',
        'crop-page.title': 'Culture',
        'crop-page.task-type.observation': 'Observation',
        'crop-page.task-table.title': 'Tâches',
        'crop-page.crop_location-table.title': 'Emplacements',
        'crops-page.title': 'Cultures',
        'dashboard-page.title': 'Tableau de bord',
        'login-page.title': 'Connexion',
        'login-page.button.demo': 'Démo',
        'login-page.button.signup': 'Inscription',
        'login-page.button.login': 'Connexion',
        'model-view-page.button.edit': 'Modifier',
        'model-view-page.button.delete': 'Supprimer',
        'organization-page.button.articles': 'Articles',
        'organization-page.button.purchases': 'Achats',
        'organization-page.button.sales': 'Ventes',
        'outputs-page.title': 'Récoltes',
        'output-page.task-table.title': 'Tâches',
        'planner-page.title': 'Plan de culture',
        'role-page.role_access-table.title': 'Permissions',
        'roles-page.title': 'Rôles',
        'signup-page.title': 'Inscription',
        'suppliers-page.title': 'Fournisseurs',
        'task-page.features-table.title': 'Caractéristiques',
        'users-page.title': 'Utilisateurs',
        'varieties-page.title': 'Variétés',
        'zones-page.title': 'Zones',
        'zones-page.zone-table.block-x-beds': '%{block}: %{bedCount} planches',
        'zone-page.block-table.title': 'Blocs',
        'zone-page.block-table.x-beds': '%{bedCount} planches',

        // Model
        'model.name.article': 'Article',
        'model.name.article_variety': 'Plante / Variété',
        'model.name.bed': 'Planche',
        'model.name.block': 'Bloc',
        'model.name.crop': 'Culture',
        'model.name.crop_location': 'Emplacement',
        'model.name.entity': 'Ferme',
        'model.name.organization': 'Organisation',
        'model.name.output': 'Récolte',
        'model.name.photo': 'Photo',
        'model.name.planting': 'Plantation',
        'model.name.role': 'Rôle',
        'model.name.role_access': 'Permission',
        'model.name.seedling': 'Semis',
        'model.name.task': 'Tâche',
        'model.name.tooling': 'Outil',
        'model.name.transplanting': 'Repiquage',
        'model.name.stage': 'Stade phénologique',
        'model.name.variety': 'Variété',
        'model.name.working': 'Temps de travail',
        'model.name.user_role': 'Utilisateur / Rôle',
        'model.name.zone': 'Zone',
        'model.field.variety_id': 'Variété',
        'model.field.variety_id.null': 'Toutes variétés',
        'model.field.block_id.null': 'Tous blocs',
        'model.field.bed_id.null': 'Toutes planches',
        'model.field.done': 'Statut',
        'model.field.done.true': 'Terminé(e)',
        'model.field.done.false': 'Prévu(e)',
        'model.field.active': 'Statut',
        'model.field.active.true': 'Actif',
        'model.field.active.false': 'Inactif',
        'model.field.article_id': 'Article',
        'model.field.organization_id': 'Organisation',
        'model.field.category_id': 'Catégorie',
        'model.field.price_without_tax': 'Prix HT',
        'model.field.price_with_tax': 'Prix TTC',
        'model.field.tax': 'TVA',
        'model.field.quantity': 'Quantité',
        'model.field.quantity_unit': 'Unité',
        'model.field.date': 'Date',
        'model.field.crop_id': 'Culture',
        'model.field.farm': 'Ferme',
        'model.field.number': 'Numéro',
        'model.field.nursery': 'Pépinière',
        'model.field.name': 'Nom',
        'model.field.mwu': 'UTH',

        // Dialog
        'model-dialog.title.create': 'Ajout %{model}',
        'model-dialog.title.edit': 'Modification %{model}',
        'model-dialog.button.cancel': 'Annuler',
        'model-dialog.button.save': 'Enregistrer',

        // Popup
        'confirm-popup.button.yes': 'Oui',
        'confirm-popup.button.no': 'Non',
        'confirm-popup.logout.message': 'Voulez-vous vraiment vous déconnecter ?',
        'delete-popup.body.message': 'Voulez-vous vraiment supprimer "%{name}" ?',
        'delete-popup.checkbox.label': 'Confirmer la suppression',
        'error-popup.title': 'Erreurs',
        'error-popup.button.close': 'Fermer',
        'menu-popup.title.create': 'Ajouter',
        'menu-popup.button.edit': 'Modifier',
        'menu-popup.button.delete': 'Supprimer',

        // Form
        'form.field.name': 'Nom',
        'form.field.first_name': 'Prénom',
        'form.field.last_name': 'Nom',
        'form.field.email': 'Email',
        'form.field.password': 'Mot de passe',
        'form.field.password_confirm': 'Confirmation mot de passe',
        'form.field.title': 'Titre',
        'form.field.description': 'Description',
        'form.field.number': 'Numéro',
        'form.field.serial_number': 'Série',
        'form.field.date': 'Date',
        'form.field.time': 'Heure',
        'form.field.unit_price': 'Prix unitaire',
        'form.field.tax': 'TVA',
        'form.field.quantity': 'Quantité',
        'form.field.active': 'Actif',
        'form.field.done': 'Terminé',
        'form.field.supplier': 'Fournisseur',
        'form.field.client': 'Client',
        'form.field.search': 'Recherche',
        'form.field.category_id': 'Catégorie',
        'form.field.quantity_unit_id': 'Unité',
        'form.field.duration': 'Durée',
        'form.field.mwu': 'UTH',
        'form.field.role_id': 'Rôle',
        'form.field.zone_id': 'Zone',
        'form.field.block_id': 'Bloc',
        'form.field.bed_id': 'Planche',
        'form.field.plant_id': 'Plante',
        'form.field.variety_id': 'Variété',
        'form.field.organization_id': 'Organisation',
        'form.field.article_id': 'Article',
        'form.field.crop_id': 'Culture',
        'form.field.task_id': 'Tâche',
        'form.field.output_id': 'Récolte',
        'form.field.nursery': 'Pépinière',
        'form.field.density': 'Densité',
        'form.field.density_unit_id': 'Unité',
        'form.field.intra_row_spacing': 'Espacement sur le rang',
        'form.field.inter_row_spacing': 'Espacement entre rangs',
        'form.field.area': 'Surface',
        'form.field.area_unit_id': 'Unité',
        'form.field.resource': 'Ressource',
        'form.field.create': 'Ajout',
        'form.field.update': 'Modification',
        'form.field.delete': 'Suppression',
        'form.placeholder.name': 'Nom',
        'form.placeholder.first_name': 'Prénom',
        'form.placeholder.last_name': 'Nom',
        'form.placeholder.email': 'Email',
        'form.placeholder.password': 'Mot de passe',
        'form.placeholder.password_confirm': 'Confirmation mot de passe',
        'form.placeholder.title': 'Titre',
        'form.placeholder.description': 'Description',
        'form.placeholder.number': 'Numéro',
        'form.placeholder.serial_number': 'Série',
        'form.placeholder.date': 'Date',
        'form.placeholder.time': 'Heure',
        'form.placeholder.unit_price': 'Prix unitaire',
        'form.placeholder.tax': 'TVA',
        'form.placeholder.quantity': 'Quantité',
        'form.placeholder.active': 'Actif',
        'form.placeholder.done': 'Terminé',
        'form.placeholder.supplier': 'Fournisseur',
        'form.placeholder.client': 'Client',
        'form.placeholder.search': 'Recherche',
        'form.placeholder.category_id': 'Catégorie',
        'form.placeholder.quantity_unit_id': 'Unité',
        'form.placeholder.duration': 'Durée',
        'form.placeholder.mwu': 'UTH',
        'form.placeholder.role_id': 'Rôle',
        'form.placeholder.zone_id': 'Zone',
        'form.placeholder.block_id': 'Bloc',
        'form.placeholder.bed_id': 'Planche',
        'form.placeholder.plant_id': 'Plante',
        'form.placeholder.variety_id': 'Variété',
        'form.placeholder.organization_id': 'Organisation',
        'form.placeholder.article_id': 'Article',
        'form.placeholder.crop_id': 'Culture',
        'form.placeholder.task_id': 'Tâche',
        'form.placeholder.output_id': 'Récolte',
        'form.placeholder.nursery': 'Pépinière',
        'form.placeholder.density': 'Densité',
        'form.placeholder.density_unit_id': 'Unité',
        'form.placeholder.intra_row_spacing': 'Espacement sur le rang',
        'form.placeholder.inter_row_spacing': 'Espacement entre rangs',
        'form.placeholder.area': 'Surface',
        'form.placeholder.area_unit_id': 'Unité',
        'form.placeholder.resource': 'Ressource',
        'form.placeholder.create': 'Ajout',
        'form.placeholder.update': 'Modification',
        'form.placeholder.delete': 'Suppression',
        'form.validator.required': '%{field}: champ requis',
        'form.validator.email': '%{field}: format non valide',
        'form.validator.password_not_equal': 'Mots de passe différents',
        'form.validator.not-unique': '%{model}: existe déjà',
        'form.validator.greater': '%{field}: supérieur(e) à %{value}',
        'form.validator.greater-or-equal': '%{field}: supérieur(e) ou égal(e) à %{value}',
        'form.validator.lesser': '%{field}: inférieur(e) à %{value}',
        'form.validator.lesser-or-equal': '%{field}: inférieur(e) ou égal(e) à %{value}',
        'form.validator.at-least-x-chars-required': '%{field}: au moins %{charCount} caractères requis',
        'form.validator.at-most-x-chars-required': '%{field}: au plus %{charCount} caractères requis',
        'form.validator.at-least-one-option-required': '%{field}: au moins une option requise',
        'form.validator.datetime-greater-than-x': '%{field}: doit être supérieur(e) à %{datetime}',

        // Date
        'date.today': 'Aujourd\'hui',
        'date.day.mon': 'Lun',
        'date.day.tue': 'Mar',
        'date.day.wed': 'Mer',
        'date.day.thu': 'Jeu',
        'date.day.fri': 'Ven',
        'date.day.sat': 'Sam',
        'date.day.sun': 'Dim',
        'date.month.jan': 'Janv',
        'date.month.feb': 'Févr',
        'date.month.mar': 'Mars',
        'date.month.apr': 'Avr',
        'date.month.may': 'Mai',
        'date.month.jun': 'Juin',
        'date.month.jul': 'Juil',
        'date.month.aug': 'Août',
        'date.month.sep': 'Sept',
        'date.month.oct': 'Oct',
        'date.month.nov': 'Nov',
        'date.month.dec': 'Déc',
    };
});