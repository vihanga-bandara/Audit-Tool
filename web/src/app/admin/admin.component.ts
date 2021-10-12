import {Component, OnInit} from '@angular/core';
import {AdminApiService} from './admin.api.service';
import {User} from '@shared/models/user';
import {Product} from '@shared/models/product';
import {Organization} from '@shared/models/organization';
import {AuthService} from '@shared/services/auth/auth.service';
import {AlertComponent} from '@shared/components/alert/alert.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
    users = [];
    products = [];
    organizations = [];
    currentUserId = null;
    currentUserName = '';
    faSpinner = faSpinner;
    loader = false;
    addProductButtonDisabled = false;
    addProductToUserButtonDisabled = false;
    addOrganisationButtonDisabled = false;

    productUserForm = this.fb.group({
        product: ['', Validators.required],
        userIds: ['', Validators.required],
    });

    productForm = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        organization: ['', Validators.required],
        userIds: ['', Validators.required],
    });

    organizationForm = this.fb.group({
        name: ['', Validators.required],
        email: [''],
        phone: [''],
    });

    constructor(
        private adminService: AdminApiService,
        private authService: AuthService,
        private spinner: NgxSpinnerService,
        private alert: AlertComponent,
        private fb: FormBuilder,
    ) {
    }

    async ngOnInit() {
        this.showSpinner();
        await Promise.all([
            this.getCurrentUser(),
            this.getAllProducts(),
            this.getAllUsers(),
            this.getAllOrganizations(),
        ]);

        if (this.users && this.products && this.organizations && this.currentUserId && this.currentUserName) {
            this.hideSpinner();
        }
    }

    async getAllUsers() {
        this.users = await this.adminService.getAllUsers();
    }

    async getAllProducts() {
        this.products = await this.adminService.getAllProducts();
    }

    async getAllOrganizations() {
        this.organizations = await this.adminService.getAllOrganizations();
    }

    async getCurrentUser() {
        const user = await this.authService.getCurrentUser();
        if (user) {
            this.currentUserId = user.userId;
            this.currentUserName = user.given_name;
        }
    }

    async addUserToProject() {
        const {product, userIds} = this.productUserForm.value;

        if (product && userIds) {
            const result = await this.adminService.addProductUser(product, userIds);

            if (result) {
                this.reset();
                this.alert.showSuccess('User added successfuly', 'Done');
            } else {
                this.alert.showError('Cannot add the user', 'Error');
            }
        } else {
            this.alert.showError(
                'Please select at least one user and a Product',
                'Warning',
            );
        }
    }

    async addProduct() {
        const {name, description, organization, userIds} = this.productForm.value;

        if (!name) {
            this.alert.showError(
                'Product name is required',
                'Error',
            );
            return;
        }

        if (!organization) {
            this.alert.showError(
                'Organization is required',
                'Error',
            );
            return;
        }

        if (!userIds) {
            this.alert.showError('At least one user is required', 'Error');
            return;
        }

        this.addProductButtonDisabled = true;

        const product = new Product();
        product.name = name;
        product.description = description;
        product.organizationId = organization;
        product.users = userIds;
        product.userId = this.currentUserId;
        const result = await this.adminService.addProduct(product);
        if (result) {
            await this.reset();
            this.alert.showSuccess('Product added successfuly', 'Done');
            this.addProductButtonDisabled = false;
        } else {
            this.alert.showError('Cannot add the product', 'Error');
            this.addProductButtonDisabled = false;
        }
    }

    async addOrganization() {
        const {name, email, phone} = this.organizationForm.value;

        if (name) {
            const organization = new Organization();
            organization.name = name;
            organization.email = email;
            organization.phoneNumber = phone;

            const result = await this.adminService.addOrganization(organization);

            if (result) {
                this.reset();
                this.alert.showSuccess('Organization added successfuly', 'Done');
            } else {
                this.alert.showError('Cannot add the organization', 'Error');
            }
        } else {
            this.alert.showError('Organization name is required', 'Error');
        }
    }

    async reset() {
        await this.showSpinner();
        this.users = [];
        this.products = [];
        this.organizations = [];

        this.productUserForm = this.fb.group({
            product: ['', Validators.required],
            userIds: ['', Validators.required],
        });

        this.productForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            organization: ['', Validators.required],
            userIds: ['', Validators.required],
        });

        this.organizationForm = this.fb.group({
            name: ['', Validators.required],
            email: [''],
            phone: [''],
        });

        await Promise.all([
            this.getAllProducts(),
            this.getAllUsers(),
            this.getAllOrganizations(),
        ]);

        if (this.products && this.users && this.organizations) {
            this.hideSpinner();
        }
    }

    async showSpinner() {
        await this.spinner.show();
    }

    async hideSpinner() {
        this.loader = true;
        await this.spinner.hide();
    }
}
