'use strict';

define([], function () {
    return {
        'loader.default-text': 'Chargement',
        'main-menu-panel.button.planner': 'Calendrier',
        'main-menu-panel.button.entity': 'Ferme',
        'main-menu-panel.button.crops': 'Cultures',
        'main-menu-panel.button.suppliers': 'Fournisseurs',
        'main-menu-panel.button.clients': 'Clients',
        'main-menu-panel.button.logout': 'Déconnexion',

        // Page
        'authentication-page.title': 'Fermes',
        'article-page.title': 'Article',
        'article-page.variety-table.title': 'Plantes / Variétés',
        'articles-page.title': 'Articles',
        'clients-page.title': 'Clients',
        'crop-page.title': 'Culture',
        'crop-page.task-table.title': 'Tâches',
        'crops-page.title': 'Cultures',
        'dashboard-page.title': 'Tableau de bord',
        'entity-page.title': 'Ferme',
        'entity-page.button.varieties': 'Variétés',
        'entity-page.button.articles': 'Articles',
        'entity-page.button.zones': 'Foncier',
        'login-page.title': 'Connexion',
        'login-page.button.submit': 'Connexion',
        'model-view-page.button.edit': 'Editer',
        'model-view-page.button.delete': 'Supprimer',
        'organization-page.button.articles': 'Articles',
        'organization-page.button.purchases': 'Achats',
        'organization-page.button.sales': 'Ventes',
        'planner-page.title': 'S%{week} %{month} %{year}',
        'task-page.children-table.title': 'Caractéristiques',
        'suppliers-page.title': 'Fournisseurs',
        'varieties-page.title': 'Variétés',

        // Model
        'model.name.article': 'Article',
        'model.name.article_variety': 'Plante / Variété',
        'model.name.crop': 'Culture',
        'model.name.organization': 'Organisation',
        'model.name.output': 'Récolte',
        'model.name.task': 'Tâche',
        'model.name.variety': 'Variété',
        'model.name.working': 'Temps de travail',
        'model.field.variety_id.null': 'Toutes variétés',
        'model.field.done': 'Statut',
        'model.field.done.true': 'Terminé',
        'model.field.done.false': 'En cours',
        'model.field.active': 'Statut',
        'model.field.active.true': 'Actif',
        'model.field.active.false': 'Inactif',
        'model.field.category_id': 'Categorie',
        'model.field.price_without_tax': 'Prix HT',
        'model.field.price_with_tax': 'Prix TTC',
        'model.field.tax': 'TVA',
        'model.field.quantity_unit': 'Unité',
        'model.field.date': 'Date',
        'model.field.crop_id': 'Culture',

        // Dialog
        'model-dialog.title.create': 'Création %{model}',
        'model-dialog.title.edit': 'Edition %{model}',
        'model-dialog.button.cancel': 'Annuler',
        'model-dialog.button.save': 'Enregistrer',

        // Popup
        'confirm-popup.button.yes': 'Oui',
        'confirm-popup.button.no': 'Non',
        'confirm-popup.logout.message': 'Voulez-vous vraiment vous déconnecter ?',
        'delete-popup.body.message': 'Voulez-vous vraiment supprimer "%{name}" ?',
        'delete-popup.checkbox.label': 'Confirmer la suppression',
        'error-popup.button.close': 'Fermer',
        'menu-popup.title.create': 'Création',
        'menu-popup.button.edit': 'Editer',
        'menu-popup.button.delete': 'Supprimer',

        // Form
        'form.field.name': 'Nom',
        'form.field.email': 'Email',
        'form.field.password': 'Mot de passe',
        'form.field.title': 'Titre',
        'form.field.description': 'Description',
        'form.field.number': 'Numéro',
        'form.field.date': 'Date',
        'form.field.time': 'Heure',
        'form.field.unit-price': 'Prix unitaire',
        'form.field.quantity': 'Quantité',
        'form.field.active': 'Actif',
        'form.field.done': 'Terminé',
        'form.field.supplier': 'Fournisseur',
        'form.field.client': 'Client',
        'form.field.search': 'Recherche',
        'form.placeholder.name': 'Nom',
        'form.placeholder.email': 'Email',
        'form.placeholder.password': 'Mot de passe',
        'form.placeholder.title': 'Titre',
        'form.placeholder.description': 'Description',
        'form.placeholder.number': 'Numéro',
        'form.placeholder.date': 'Date',
        'form.placeholder.time': 'Heure',
        'form.placeholder.unit-price': 'Prix unitaire',
        'form.placeholder.quantity': 'Quantité',
        'form.placeholder.active': 'Actif',
        'form.placeholder.done': 'Terminé',
        'form.placeholder.supplier': 'Fournisseur',
        'form.placeholder.client': 'Client',
        'form.placeholder.search': 'Recherche',
        'form.validator.required': '%{field}: champ requis',
        'form.validator.email': '%{field}: format non valide',
        'form.validator.not-unique': '%{model}: ce modèle existe déjà',
        'form.validator.at-least-x-chars-required': '%{field}: au moins %{charCount} caractères requis',
        'form.validator.at-most-x-chars-required': '%{field}: au plus %{charCount} caractères requis',
        'form.validator.at-least-one-option-required': '%{field}: au moins une option requise',

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