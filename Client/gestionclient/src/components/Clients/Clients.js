import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import  {createClient, getAll, editClient, deleteClientR}  from '../../services/clientData';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import './Clients.css';

function Clients () {

    let emptyClient = {
        CT_Num: '',
        CT_Intitule: '',
        CT_Classement: '',
        CT_Contact: '',
        CT_Adresse: '',
        CT_CodePostal: null,
        CT_Ville: '',
        CT_Pays: '',
        CT_Telephone: null,
        cbCreation: ''
    };

    const [clients, setClients] = useState(null);
    const [clientDialog, setClientDialog] = useState(false);
    const [deleteClientDialog, setDeleteClientDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [client, setClient] = useState(emptyClient);
    const [selectedClients, setSelectedClients] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getAll().then(data =>{ console.log(data)
            setClients(data)});
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const openNew = () => {
        setClient(emptyClient);
        setSubmitted(false);
        setClientDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setClientDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteClientDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const saveProduct = () => {
        setSubmitted(true);
        if (client.CT_Num.trim() && client?.CT_Num.trim() && client?.CT_Intitule.trim() && client?.CT_Classement.trim() && client?.CT_Contact.trim() && client?.CT_Adresse.trim() && client?.CT_Ville.trim() && client?.CT_Pays.trim()) 
        {
            let _clients = [...clients];
            let _client = {...client};
            const index = findIndexById(client.CT_Num);
        //    console.log(clients[index].CT_Num === client.CT_Num)
            if (client.CT_Num === _clients[index]?.CT_Num) {
                _clients[index] = _client;
                editClient(client.CT_Num,client).then(()=>{
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'client Updated', life: 3000 });
            }).catch(err => console.error('error from edit: ', err))
            }
            else {
                _client.id = createId();
                _client.image = 'client-placeholder.svg';
                _clients.push(_client);
                createClient(_client).then(()=>{
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'client Created', life: 3000 });
            }).catch(err => console.error('error from edit: ', err))
            }

            setClients(_clients);
            setClientDialog(false);
            setClient(emptyClient);
        }

    }

    const editProduct = (client) => {
        setClient({...client});
        setClientDialog(true);
    }

    const confirmDeleteProduct = (client) => {
        setClient(client);
        deleteClientR(client.CT_Num)
        setDeleteClientDialog(true);
    }

    const deleteClient = () => {
        let _clients = clients.filter(val => val.id !== client.id);
        setClients(_clients);
        setDeleteClientDialog(false);
        setClient(emptyClient);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'client Deleted', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].CT_Num === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const importCSV = (e) => {
        const file = e.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const csv = e.target.result;
            const data = csv.split('\n');

            // Prepare DataTable
            const cols = data[0].replace(/['"]+/g, '').split(',');
            data.shift();

            const importedData = data.map(d => {
                d = d.split(',');
                const processedData = cols.reduce((obj, c, i) => {
                    c = c === 'Status' ? 'inventoryStatus' : (c === 'Reviews' ? 'rating' : c.toLowerCase());
                    obj[c] = d[i].replace(/['"]+/g, '');
                    (c === 'price' || c === 'rating') && (obj[c] = parseFloat(obj[c]));
                    return obj;
                }, {});

                processedData['id'] = createId();
                return processedData;
            });

            const _products = [...clients, ...importedData];

            setClients(_products);
        };

        reader.readAsText(file, 'UTF-8');
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    }

    const deleteSelectedClients = () => {
        let _clients = clients.filter(val => !selectedClients.includes(val));
        setClients(_clients);
        setDeleteProductsDialog(false);
        setSelectedClients(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'clients Deleted', life: 3000 });
    }

  

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = {...client};
        _product[`${name}`] = val;

        setClient(_product);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = {...client};
        _product[`${name}`] = val;

        setClient(_product);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedClients || !selectedClients.length} />
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Import" className="mr-2 inline-block" onUpload={importCSV} />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }



    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Manage clients</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const ClientDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteClientDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteClient} />
        </React.Fragment>
    );
    const deleteClientsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedClients} />
        </React.Fragment>
    );

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={clients} selection={selectedClients} onSelectionChange={(e) => setSelectedClients(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} clients"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    <Column field="CT_Num" header="CT_Num" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="CT_Intitule" header="CT_Intitule" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="CT_Classement" header="CT_Classement" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="CT_Contact" header="CT_Contact" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="CT_Adresse" header="CT_Adresse" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="CT_CodePostal" header="CT_CodePostal" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="CT_Ville" header="CT_Ville" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="CT_Pays" header="CT_Pays" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="CT_Telephone" header="CT_Telephone" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="cbCreation" header="cbCreation" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '9rem' }}></Column>
                </DataTable>
            </div>
            <Dialog visible={clientDialog} style={{ width: '450px' }} header="client Details" modal className="p-fluid" footer={ClientDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="CT_Num">CT_Num</label>
                    <InputText id="CT_Num" value={client.CT_Num} onChange={(e) => onInputChange(e, 'CT_Num')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.CT_Num })} />
                    {submitted && !client.CT_Num && <small className="p-error">CT_Num is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="CT_Intitule">CT_Intitule</label>
                    <InputText id="CT_Intitule" value={client.CT_Intitule} onChange={(e) => onInputChange(e, 'CT_Intitule')} required minLength={3} maxLength={50} />
                    {submitted && !client.CT_Intitule &&<small className='p-error'>CT_Intitule should be at least 3 characters long and max 50 characters long</small>}
                </div>
                <div className="field">
                    <label htmlFor="CT_Classement">CT_Classement</label>
                    <InputText id="CT_Classement" value={client.CT_Classement} onChange={(e) => onInputChange(e, 'CT_Classement')} required minLength={3} maxLength={50} />
                    {submitted && !client.CT_Classement && <small className='p-error'>CT_Classement should be at least 3 characters long and max 50 characters long</small>}

                </div>
                <div className="field">
                    <label htmlFor="CT_Adresse">CT_Adresse</label>
                    <InputText id="CT_Adresse" value={client.CT_Adresse} onChange={(e) => onInputChange(e, 'CT_Adresse')}required   />
                    {submitted && !client.CT_Adresse && <small className='p-error'>CT_Adresse must be between </small>}

                </div>
                <div className="field">
                    <label htmlFor="CT_Contact">CT_Contact</label>
                    <InputText id="CT_Contact" value={client.CT_Contact} onChange={(e) => onInputChange(e, 'CT_Contact')} required  minLength={3} maxLength={50}/>
                    {submitted && !client.CT_Contact && <small className="p-error">CT_Contact should be at least 3 characters long and max 50 characters long.</small>}

                </div>
                <div className="field">
                    <label htmlFor="CT_Ville">CT_Ville</label>
                    <InputText id="CT_Ville" value={client.CT_Ville} onChange={(e) => onInputChange(e, 'CT_Ville')}   minLength={3} maxLength={50}/>
                    {submitted && !client.CT_Ville &&<small className='p-error'>CT_Intitule should be at least 3 characters long and max 50 characters long</small>}

                </div>
                <div className="field">
                    <label htmlFor="CT_Pays">CT_Pays</label>
                    <InputText id="CT_Pays" value={client.CT_Pays} onChange={(e) => onInputChange(e, 'CT_Pays')} minLength={3} maxLength={50}  />
                    {submitted && !client.CT_Pays &&<small className='p-error'>CT_Pays should contains only english letters</small>}

                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="CT_CodePostal">CT_CodePostal</label>
                        <InputNumber id="CT_CodePostal" value={client.CT_CodePostal} onValueChange={(e) => onInputNumberChange(e, 'CT_CodePostal')} />
                    </div>
                    <div className="field col">
                        <label htmlFor="CT_Telephone">CT_Telephone</label>
                        <InputNumber id="CT_Telephone" value={client.CT_Telephone} onValueChange={(e) => onInputNumberChange(e, 'CT_Telephone')} required/>
                        {submitted && !client.CT_Telephone &&<small className='p-error'>CT_Telephone should be at least 3 characters long and max 50 characters long</small>}
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteClientDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteClientDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {client && <span>Are you sure you want to delete <b>{client.CT_Num}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteClientsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {client && <span>Are you sure you want to delete the selected clients?</span>}
                </div>
            </Dialog>
        </div>
    );
}
                
export default Clients;