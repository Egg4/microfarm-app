'use strict';

define([], function () {
    return {
        'loader.default-text': 'Chargement',
        'main-menu-panel.button.logout': 'Déconnexion',

        // Page
        'authentication-page.title': 'Fermes',
        'article-page.title': 'Article',
        'articles-page.title': 'Articles',
        'clients-page.title': 'Clients',
        'crop-page.title': 'Culture',
        'crops-page.title': 'Cultures',
        'dashboard-page.title': 'Tableau de bord',
        'entity-page.title': 'Ferme',
        'entity-page.button.varieties': 'Variétés',
        'entity-page.button.articles': 'Articles',
        'entity-page.button.zones': 'Foncier',
        'login-page.title': 'Connexion',
        'login-page.button.submit': 'Connexion',
        'organization-page.button.articles': 'Articles',
        'organization-page.button.purchases': 'Achats',
        'organization-page.button.sales': 'Ventes',
        'suppliers-page.title': 'Fournisseurs',
        'varieties-page.title': 'Variétés',

        // Model
        'model.name.article': 'Article',
        'model.name.crop': 'Culture',
        'model.name.organization': 'Organisation',
        'model.name.variety': 'Variété',

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
        'menu-popup.button.edit': 'Editer',
        'menu-popup.button.delete': 'Supprimer',

        // Form
        'form.field.name': 'Nom',
        'form.field.email': 'Email',
        'form.field.password': 'Mot de passe',
        'form.field.title': 'Titre',
        'form.field.number': 'Numéro',
        'form.field.unit-price': 'Prix unitaire',
        'form.field.active': 'Actif',
        'form.field.supplier': 'Fournisseur',
        'form.field.client': 'Client',
        'form.field.search': 'Recherche',
        'form.placeholder.name': 'Nom',
        'form.placeholder.email': 'Email',
        'form.placeholder.password': 'Mot de passe',
        'form.placeholder.title': 'Titre',
        'form.placeholder.number': 'Numéro',
        'form.placeholder.unit-price': 'Prix unitaire',
        'form.placeholder.active': 'Actif',
        'form.placeholder.supplier': 'Fournisseur',
        'form.placeholder.client': 'Client',
        'form.placeholder.search': 'Recherche',
        'form.validator.required': '%{field}: champ requis',
        'form.validator.email': '%{field}: format non valide',
        'form.validator.not-unique': '%{model}: ce modèle existe déjà',
        'form.validator.at-least-x-chars-required': '%{field}: au moins %{charCount} caractères requis',
        'form.validator.at-most-x-chars-required': '%{field}: au plus %{charCount} caractères requis',
        'form.validator.at-least-one-option-required': '%{field}: au moins une option requise',
    };
});