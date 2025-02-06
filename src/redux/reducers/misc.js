import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    addCustomersDrawerIsOpened: false,
    addPeoplesDrawerIsOpened: false,
    addCompaniesDrawerIsOpened: false,
    addLeadsDrawerIsOpened: false,
    addProductsDrawerIsOpened: false,
    addProductsCategoryDrawerIsOpened: false,
    addExpensesDrawerIsOpened: false,
    addExpensesCategoryDrawerIsOpened: false,
    addOffersDrawerIsOpened: false,
    addInvoicesDrawerIsOpened: false,
    addProformaInvoicesDrawerIsOpened: false,
    addPaymentsDrawerIsOpened: false,
    addEmployeeDrawerIsOpened: false,
    editCustomersDrawerIsOpened: false,
    editPeoplesDrawerIsOpened: false,
    editCompaniesDrawerIsOpened: false,
    editLeadsDrawerIsOpened: false,
    editProductsDrawerIsOpened: false,
    editProductsCategoryDrawerIsOpened: false,
    editExpensesDrawerIsOpened: false,
    editExpensesCategoryDrawerIsOpened: false,
    editOffersDrawerIsOpened: false,
    editInvoicesDrawerIsOpened: false,
    editProformaInvoicesDrawerIsOpened: false,
    editPaymentsDrawerIsOpened: false,
    editAdminsDrawerIsOpened: false,
    editSupportDrawerIsOpened: false,
    editIndiamartLeadDrawerIsOpened: false,
    showDetailsCustomersDrawerIsOpened: false,
    showDetailsPeoplesDrawerIsOpened: false,
    showDetailsCompaniesDrawerIsOpened: false,
    showDetailsLeadsDrawerIsOpened: false,
    showNotificationsDetailsLeadsDrawerIsOpened: false,
    showDetailsProductsDrawerIsOpened: false,
    showDetailsProductsCategoryDrawerIsOpened: false,
    showDetailsExpensesDrawerIsOpened: false,
    showDetailsExpensesCategoryDrawerIsOpened: false,
    showDetailsOffersDrawerIsOpened: false,
    showDetailsInvoicesDrawerIsOpened: false,
    showDetailsProformaInvoicesDrawerIsOpened: false,
    showDetailsPaymentsDrawerIsOpened: false,
    showDetailsAdminsDrawerIsOpened: false,
    showDetailsSupportDrawerIsOpened: false,
    showDetailsIndiamartLeadIsOpened: false,
    sendSMSDrawerIsOpened: false,
    showBulkAssignDrawerIsOpened: false,
}

const miscSlice = createSlice({
    name: "misc",
    initialState,
    reducers: {
        
        openAddEmployeeDrawer: (state)=>{state.addEmployeeDrawerIsOpened = true},
        closeAddEmployeeDrawer: (state)=>{state.addEmployeeDrawerIsOpened = false;},
        
        openAddCustomersDrawer: (state)=>{state.addCustomersDrawerIsOpened = true},
        closeAddCustomersDrawer: (state)=>{state.addCustomersDrawerIsOpened = false;},

        openEditCustomersDrawer: (state)=>{state.editCustomersDrawerIsOpened = true},
        closeEditCustomersDrawer: (state)=>{state.editCustomersDrawerIsOpened = false;},

        openShowDetailsCustomersDrawer: (state)=>{state.showDetailsCustomersDrawerIsOpened = true},
        closeShowDetailsCustomersDrawer: (state)=>{state.showDetailsCustomersDrawerIsOpened = false;},

        openAddPeoplesDrawer: (state)=>{state.addPeoplesDrawerIsOpened = true},
        closeAddPeoplesDrawer: (state)=>{state.addPeoplesDrawerIsOpened = false},

        openEditPeoplesDrawer: (state)=>{state.editPeoplesDrawerIsOpened = true},
        closeEditPeoplesDrawer: (state)=>{state.editPeoplesDrawerIsOpened = false},

        openShowDetailsPeoplesDrawer: (state)=>{state.showDetailsPeoplesDrawerIsOpened = true},
        closeShowDetailsPeoplesDrawer: (state)=>{state.showDetailsPeoplesDrawerIsOpened = false},

        openAddCompaniesDrawer: (state)=>{state.addCompaniesDrawerIsOpened = true},
        closeAddCompaniesDrawer: (state)=>{state.addCompaniesDrawerIsOpened = false},

        openEditCompaniesDrawer: (state)=>{state.editCompaniesDrawerIsOpened = true},
        closeEditCompaniesDrawer: (state)=>{state.editCompaniesDrawerIsOpened = false},

        openShowDetailsCompaniesDrawer: (state)=>{state.showDetailsCompaniesDrawerIsOpened = true},
        closeShowDetailsCompaniesDrawer: (state)=>{state.showDetailsCompaniesDrawerIsOpened = false},

        openAddLeadsDrawer: (state)=>{state.addLeadsDrawerIsOpened = true},
        closeAddLeadsDrawer: (state)=>{state.addLeadsDrawerIsOpened = false},

        openEditLeadsDrawer: (state)=>{state.editLeadsDrawerIsOpened = true},
        closeEditLeadsDrawer: (state)=>{state.editLeadsDrawerIsOpened = false},

        openShowDetailsLeadsDrawer: (state)=>{state.showDetailsLeadsDrawerIsOpened = true},
        closeShowDetailsLeadsDrawer: (state)=>{state.showDetailsLeadsDrawerIsOpened = false},

        openNotificationsShowDetailsLeadsDrawer: (state)=>{state.showNotificationsDetailsLeadsDrawerIsOpened = true},
        closeNotificationsShowDetailsLeadsDrawer: (state)=>{state.showNotificationsDetailsLeadsDrawerIsOpened = false},

        openAddProductsDrawer: (state)=>{state.addProductsDrawerIsOpened = true},
        closeAddProductsDrawer: (state)=>{state.addProductsDrawerIsOpened = false},

        openEditProductsDrawer: (state)=>{state.editProductsDrawerIsOpened = true},
        closeEditProductsDrawer: (state)=>{state.editProductsDrawerIsOpened = false},

        openEditSupportDrawer: (state)=>{state.editSupportDrawerIsOpened = true},
        closeEditSupportDrawer: (state)=>{state.editSupportDrawerIsOpened = false},

        openEditIndiamartLeadDrawer: (state)=>{state.editIndiamartLeadDrawerIsOpened = true},
        closeEditIndiamartLeadDrawer: (state)=>{state.editIndiamartLeadDrawerIsOpened = false},

        openShowDetailsSupportDrawer: (state)=>{state.showDetailsSupportDrawerIsOpened = true},
        closeShowDetailsSupportDrawer: (state)=>{state.showDetailsSupportDrawerIsOpened = false},

        openShowDetailsProductsDrawer: (state)=>{state.showDetailsProductsDrawerIsOpened = true},
        closeShowDetailsProductsDrawer: (state)=>{state.showDetailsProductsDrawerIsOpened = false},

        openAddProductsCategoryDrawer: (state)=>{state.addProductsCategoryDrawerIsOpened = true},
        closeAddProductsCategoryDrawer: (state)=>{state.addProductsCategoryDrawerIsOpened = false},

        openEditProductsCategoryDrawer: (state)=>{state.editProductsCategoryDrawerIsOpened = true},
        closeEditProductsCategoryDrawer: (state)=>{state.editProductsCategoryDrawerIsOpened = false},

        openShowDetailsProductsCategoryDrawer: (state)=>{state.showDetailsProductsCategoryDrawerIsOpened = true},
        closeShowDetailsProductsCategoryDrawer: (state)=>{state.showDetailsProductsCategoryDrawerIsOpened = false},

        openAddExpensesDrawer: (state)=>{state.addExpensesDrawerIsOpened = true},
        closeAddExpensesDrawer: (state)=>{state.addExpensesDrawerIsOpened = false},

        openEditExpensesDrawer: (state)=>{state.editExpensesDrawerIsOpened = true},
        closeEditExpensesDrawer: (state)=>{state.editExpensesDrawerIsOpened = false},

        openShowDetailsExpensesDrawer: (state)=>{state.showDetailsExpensesDrawerIsOpened = true},
        closeShowDetailsExpensesDrawer: (state)=>{state.showDetailsExpensesDrawerIsOpened = false},

        openAddExpensesCategoryDrawer: (state)=>{state.addExpensesCategoryDrawerIsOpened = true},
        closeAddExpensesCategoryDrawer: (state)=>{state.addExpensesCategoryDrawerIsOpened = false},

        openEditExpensesCategoryDrawer: (state)=>{state.editExpensesCategoryDrawerIsOpened = true},
        closeEditExpensesCategoryDrawer: (state)=>{state.editExpensesCategoryDrawerIsOpened = false},

        openShowDetailsExpensesCategoryDrawer: (state)=>{state.showDetailsExpensesCategoryDrawerIsOpened = true},
        closeShowDetailsExpensesCategoryDrawer: (state)=>{state.showDetailsExpensesCategoryDrawerIsOpened = false},

        openAddOffersDrawer: (state)=>{state.addOffersDrawerIsOpened = true},
        closeAddOffersDrawer: (state)=>{state.addOffersDrawerIsOpened = false},

        openEditOffersDrawer: (state)=>{state.editOffersDrawerIsOpened = true},
        closeEditOffersDrawer: (state)=>{state.editOffersDrawerIsOpened = false},

        openShowDetailsOffersDrawer: (state)=>{state.showDetailsOffersDrawerIsOpened = true},
        closeShowDetailsOffersDrawer: (state)=>{state.showDetailsOffersDrawerIsOpened = false},

        openAddInvoicesDrawer: (state)=>{state.addInvoicesDrawerIsOpened = true},
        closeAddInvoicesDrawer: (state)=>{state.addInvoicesDrawerIsOpened = false},

        openEditInvoicesDrawer: (state)=>{state.editInvoicesDrawerIsOpened = true},
        closeEditInvoicesDrawer: (state)=>{state.editInvoicesDrawerIsOpened = false},

        openShowDetailsInvoicesDrawer: (state)=>{state.showDetailsInvoicesDrawerIsOpened = true},
        closeShowDetailsInvoicesDrawer: (state)=>{state.showDetailsInvoicesDrawerIsOpened = false},

        openAddProformaInvoicesDrawer: (state)=>{state.addProformaInvoicesDrawerIsOpened = true},
        closeAddProformaInvoicesDrawer: (state)=>{state.addProformaInvoicesDrawerIsOpened = false},

        openEditProformaInvoicesDrawer: (state)=>{state.editProformaInvoicesDrawerIsOpened = true},
        closeEditProformaInvoicesDrawer: (state)=>{state.editProformaInvoicesDrawerIsOpened = false},

        openShowDetailsProformaInvoicesDrawer: (state)=>{state.showDetailsProformaInvoicesDrawerIsOpened = true},
        closeShowDetailsProformaInvoicesDrawer: (state)=>{state.showDetailsProformaInvoicesDrawerIsOpened = false},

        openAddPaymentsDrawer: (state)=>{state.addPaymentsDrawerIsOpened = true},
        closeAddPaymentsDrawer: (state)=>{state.addPaymentsDrawerIsOpened = false},

        openEditPaymentsDrawer: (state)=>{state.editPaymentsDrawerIsOpened = true},
        closeEditPaymentsDrawer: (state)=>{state.editPaymentsDrawerIsOpened = false},

        openShowDetailsPaymentsDrawer: (state)=>{state.showDetailsPaymentsDrawerIsOpened = true},
        closeShowDetailsPaymentsDrawer: (state)=>{state.showDetailsPaymentsDrawerIsOpened = false},

        openEditAdminsDrawer: (state)=>{state.editAdminsDrawerIsOpened = true},
        closeEditAdminsDrawer: (state)=>{state.editAdminsDrawerIsOpened = false},

        openShowDetailsAdminsDrawer: (state)=>{state.showDetailsAdminsDrawerIsOpened = true},
        closeShowDetailsAdminsDrawer: (state)=>{state.showDetailsAdminsDrawerIsOpened = false},

        openShowDetailsIndiamartLeadDrawer: (state)=>{state.showDetailsIndiamartLeadIsOpened = true},
        closeShowDetailsIndiamartLeadDrawer: (state)=>{state.showDetailsIndiamartLeadIsOpened = false},

        openSendSMSDrawer: (state)=>{state.sendSMSDrawerIsOpened = true},
        closeSendSMSDrawer: (state)=>{state.sendSMSDrawerIsOpened = false},

        openShowBulkAssignDrawer: (state)=>{state.showBulkAssignDrawerIsOpened = true},
        closeShowBulkAssignDrawer: (state)=>{state.showBulkAssignDrawerIsOpened = false},
    }
})

export const {
    openAddCustomersDrawer,
    closeAddCustomersDrawer,
    openEditCustomersDrawer,
    closeEditCustomersDrawer,
    openShowDetailsCustomersDrawer,
    closeShowDetailsCustomersDrawer,
    openAddPeoplesDrawer,
    closeAddPeoplesDrawer,
    openShowDetailsPeoplesDrawer,
    closeShowDetailsPeoplesDrawer,
    openEditPeoplesDrawer,
    closeEditPeoplesDrawer,
    openAddCompaniesDrawer,
    closeAddCompaniesDrawer,
    openShowDetailsCompaniesDrawer,
    closeShowDetailsCompaniesDrawer,
    openEditCompaniesDrawer,
    closeEditCompaniesDrawer,
    openAddLeadsDrawer,
    closeAddLeadsDrawer,
    openShowDetailsLeadsDrawer,
    closeShowDetailsLeadsDrawer,
    openEditLeadsDrawer,
    closeEditLeadsDrawer,
    openAddProductsDrawer,
    closeAddProductsDrawer,
    openEditProductsDrawer,
    closeEditProductsDrawer,
    openShowDetailsProductsDrawer,
    closeShowDetailsProductsDrawer,
    openAddProductsCategoryDrawer,
    closeAddProductsCategoryDrawer,
    openEditProductsCategoryDrawer,
    closeEditProductsCategoryDrawer,
    openShowDetailsProductsCategoryDrawer,
    closeShowDetailsProductsCategoryDrawer,
    openAddExpensesDrawer,
    closeAddExpensesDrawer,
    openEditExpensesDrawer,
    closeEditExpensesDrawer,
    openShowDetailsExpensesDrawer,
    closeShowDetailsExpensesDrawer,
    openAddExpensesCategoryDrawer,
    closeAddExpensesCategoryDrawer,
    openEditExpensesCategoryDrawer,
    closeEditExpensesCategoryDrawer,
    openShowDetailsExpensesCategoryDrawer,
    closeShowDetailsExpensesCategoryDrawer,
    openAddOffersDrawer,
    closeAddOffersDrawer,
    openEditOffersDrawer,
    closeEditOffersDrawer,
    openShowDetailsOffersDrawer,
    closeShowDetailsOffersDrawer,
    openAddInvoicesDrawer,
    closeAddInvoicesDrawer,
    openEditInvoicesDrawer,
    closeEditInvoicesDrawer,
    openShowDetailsInvoicesDrawer,
    closeShowDetailsInvoicesDrawer,
    openAddProformaInvoicesDrawer,
    closeAddProformaInvoicesDrawer,
    openEditProformaInvoicesDrawer,
    closeEditProformaInvoicesDrawer,
    openShowDetailsProformaInvoicesDrawer,
    closeShowDetailsProformaInvoicesDrawer,
    openAddPaymentsDrawer,
    closeAddPaymentsDrawer,
    openEditPaymentsDrawer,
    closeEditPaymentsDrawer,
    openShowDetailsPaymentsDrawer,
    closeShowDetailsPaymentsDrawer,
    openEditAdminsDrawer,
    closeEditAdminsDrawer,
    openShowDetailsAdminsDrawer,
    closeShowDetailsAdminsDrawer,
    openNotificationsShowDetailsLeadsDrawer,
    closeNotificationsShowDetailsLeadsDrawer,
    openShowDetailsSupportDrawer,
    closeShowDetailsSupportDrawer,
    openEditSupportDrawer,
    closeEditSupportDrawer,
    openShowDetailsIndiamartLeadDrawer,
    closeShowDetailsIndiamartLeadDrawer,
    openEditIndiamartLeadDrawer,
    closeEditIndiamartLeadDrawer,
    openAddEmployeeDrawer,
    closeAddEmployeeDrawer,
    openSendSMSDrawer,
    closeSendSMSDrawer,
    openShowBulkAssignDrawer,
    closeShowBulkAssignDrawer
} = miscSlice.actions;
export default miscSlice;