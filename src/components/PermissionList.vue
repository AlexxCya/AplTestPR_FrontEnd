<template>
<div>
    <div v-if="!newEdit">
    <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="search"
              single-line
              hide-details
            ></v-text-field>
            
    <v-data-table dense :headers="tblHeaders" :items="itemsP" :search="search">
              <template v-slot:[`item.actions`]="{ item }">
                <td class="justify-center layout px-0">
                  <v-btn icon>
                    <v-icon small @click="editItem(item)">mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon small @click="deletedItem(item)">mdi-delete-forever</v-icon>
                  </v-btn>
                  
                </td>
              </template>
            </v-data-table>    
            <v-btn
                depressed
                color="primary"
                @click="add()"
            >
                Add
            </v-btn>
       </div>     
            <AddOrEditForm 
            :viewForm="newEdit"
            :itemEdit="itemEdit"
             @back="goBack()"
             @save="refresh()" />
     
</div>
</template>

<script>
import axios from "axios";
import AddOrEditForm from '@/components/AddOrEditForm.vue';
import Swal from "sweetalert2";
export default {
      components: {
      AddOrEditForm
  },

    data(){
        return{
            newEdit: false,
            date:'',
            search:'',
            itemsP:[
                {
                    'id':1,
                    'name':'Alex',
                    'lastName':'Jonguitud',
                    'typePermission': 2,
                    'date':'2021-06-19'
                },
                {
                    'id':2,
                    'name':'Cynthia',
                    'lastName':'Sanchez',
                    'typePermission': 3,
                    'date':'2021-06-23'
                }
            ],
            itemEdit:[],
        }
    },
    created(){
        this.getPermissions();
    },
    computed: {
    tblHeaders: function () {
      return [
        {
          text: 'Actions',
          value: "actions",
          sortable: false,
          align: "center",
        },
        {
          text: "Name",
          value: "name",
          sortable: true,
          align: "start",
        },
        {
          text: "Last Name",
          value: "lastName",
          sortable: true,
          align: "start",
        },
        {
          text: "Permission Type",
          value: "permissionType",
          sortable: true,
          align: "start",
        },
        {
          text: "Date",
          value: "date",
          sortable: true,
          align: "start",
        }
      ];
    }
  },
    methods: {
        async getPermissions() {
    
      await axios.get(this.$apiURI + "/Permissions/GetPermissions")
        .then((response) => {
          this.itemsP = [];

          if (response.data.isValid) {
            if (response.data.genericObject.length > 0) {
              response.data.genericObject.forEach((resp) => {
                let obj = {};
                obj.id = resp.id;
                obj.name = resp.name;
                obj.lastName = resp.lastName;
                obj.permissionType = resp.permissionType;
                obj.idPermissionType = resp.idPermissionType;
                obj.date = resp.date;
                
                this.itemsP.push(obj);
              });
              this.updateTableSearch();
            }
          }
        })
        .catch(function (error) {
          if(error.response.status == 401) {
              alert('Error... ' + error.response.statusText);
            //Swal.fire({ title: "Error!", text: error, icon: "error", confirmButtonText: error.response.statusText, });
          } else {
            alert('Error ------------');
          }
        });
    },
        add(){
            this.itemEdit = [];
            this.newEdit = true;
        },
        goBack(){
            this.newEdit = false;
        },
        editItem(_item){
            this.itemEdit = [];

             let obj = {};
                obj.id = _item.id;
                obj.name = _item.name;
                obj.lastName = _item.lastName;
                obj.permissionType = _item.permissionType;
                obj.idPermissionType = _item.idPermissionType;
                obj.date = _item.date;

            this.itemEdit.push(_item);
            this.newEdit = true;
        },
        refresh(){
            this.newEdit = false;
            this.getPermissions();
        },
        deletedItem(item) {
            Swal.fire({
                title: "Are you sure to delete this permission?",
                text: "",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirm",
            }).then((result) => {
                if (result.value) {
                axios.post(this.$apiURI + "/Permissions/DeletePermission?id=" + item.id)
                    .then((response) => {
                    if (response.data.isValid) {
                        Swal.fire( "Ok", "The Permission was deleted", "success");
                        this.getPermissions();
                    }
                    })
                    .catch(function (error) {
                    if(error.response.status == 401) {
                        Swal.fire({ title: "Error!", text: error, icon: "error", confirmButtonText: error.response.statusText, });
                    } else {
                        Swal.fire({ title: "Error!", text: error, icon: "error", confirmButtonText: "Ok", });
                    }
                    });
                }
            });
    },
    }
}
</script>