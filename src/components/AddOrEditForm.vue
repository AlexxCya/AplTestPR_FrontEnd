<template>
                <v-form v-if="viewForm" ref="form">
                <v-row>
                    <v-col cols="9">
                          <v-text-field
                            class="ml-1 mr-1"
                            v-model="name"
                            :rules="namesRules"
                            :counter="150"
                            label="Name"
                            required
                            @input="$v.name.$touch()"
                            @blur="$v.name.$touch()"
                            ></v-text-field>
                    </v-col>
                </v-row>
                 <v-row>    
                  <v-col cols="9">
                    <v-text-field
                      class="ml-1 mr-1"
                      v-model="lastName"
                      :rules="namesRules"
                      :counter="150"
                      label="Last Name"
                      required
                      @input="$v.lastName.$touch()"
                      @blur="$v.lastName.$touch()"
                    ></v-text-field>
                  </v-col>
                </v-row>
                 <v-row>
                  <v-col cols="9">   
                  <v-select
                      class="ml-1 mr-1"
                      v-model="selectedItem"
                      :items="itemsP"
                      label="Type"
                      :rules="requiredRules"
                    ></v-select>
                  </v-col> 
                 </v-row>
                 <v-row>
                     <v-col cols="9">
                         <v-menu
                            v-model="menu2"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="date"
                                label="Date"
                                hint="MM/DD/YYYY format"
                                persistent-hint
                                prepend-icon="mdi-calendar"
                                :rules="requiredRules"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                required
                                @input="$v.date.$touch()"
                                @blur="$v.date.$touch()"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            v-model="date"
                            no-title
                            @input="menu2 = false"
                            ></v-date-picker>
                        </v-menu>
                     </v-col>
                 </v-row>

                <v-row>
                    <v-col cols="9">
                        <v-btn
                            depressed
                            color="primary"
                            @click="save()"
                            :disabled="$v.$invalid"
                        >
                            Save
                        </v-btn>
                        <v-btn
                            depressed
                            color="error"
                            @click="$emit('back')"
                        >
                            Cancel
                        </v-btn>
                    </v-col>   
                </v-row>   
          
              </v-form>
</template>

<script>

import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import axios from "axios";
export default {
    props: ['viewForm','itemEdit'],
    mixins: [validationMixin],
  validations: {
    name: { required, maxLength: maxLength(150) },
    lastName: { required, maxLength: maxLength(150) },
    date: { required },
    selectedItem: { required },
  },
    data(){
        return{
            menu2:false,
            date:'',
            panel: [0, 1],
            disabled: false,
            name:'',
            lastName:'',
            itemsP:[],
            selectedItem:0,
            /* VALIDATIONS */
            namesRules: [
                (v) => !!v || 'this field is required',
                (v) => (v && v.length <= 150) || 'this field onle accept more less 150 characters',
            ],
            requiredRules: [
                (v) => !!v || 'this field is required',
            ],
        }
    },
    created(){
        console.log('created');
        this.fillForm();
        this.getTypes();
    },
    watch:{
        itemEdit: function() {
            console.log('watch');
            this.fillForm();
        }
    },
    methods: {
    async getTypes() {
    
       //const headers = { Authorization: `Bearer ${window.localStorage.getItem("_token")}` };

      await axios.get(this.$apiURI + "/PermissionsType/GetPermissionsType")
        .then((response) => {
          this.itemsP = [];

          if (response.data.isValid) {
            if (response.data.genericObject.length > 0) {
              response.data.genericObject.forEach((resp) => {
                let obj = {};
                obj.value = resp.id;
                obj.text = resp.description;
                
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
        fillForm(){
            if(this.itemEdit.length > 0)
            {
                this.name = this.itemEdit[0].name;
                this.lastName = this.itemEdit[0].lastName;
                this.selectedItem = this.itemEdit[0].idPermissionType;
                this.date = this.itemEdit[0].date;
            }
            else
            {
                this.name = '';
                this.lastName = '';
                this.selectedItem = 0;
                this.date = '';
            }
        },
        save() {
      //this.$v.$touch();
      //if (this.$v.$pending || this.$v.$error) return;

      if(this.itemEdit.length == 0) {
        axios.post(this.$apiURI + "/Permissions/SavePermission", {
            name: this.name,
            lastName: this.lastName,
            date: this.date,
            idPermissionType: this.selectedItem
          },)
          .then((response) => {
            if (response.data.isValid) {
              //Swal.fire({position: "center", type:'success', icon: "success", title: this.lng.msg.save, showConfirmButton: false, timer: this.sessionMenu.swayAlertTimerDelayMS});
              //this.get();
              //this.cleanForm();
              //alert('Ok');
              this.$emit('save');
            } else {
              //Swal.fire({ title: "Error!", text: response.data.message, icon: "error", confirmButtonText: this.lng.action.ok });
              alert("error--------------")
            }
          })
          .catch(function (error) {
           if(error.response.status == 401) {
              alert('Error... ' + error.response.statusText);
            //Swal.fire({ title: "Error!", text: error, icon: "error", confirmButtonText: error.response.statusText, });
          } else {
            alert('Error ------------' + error);
          }
          });
      } else {
        axios.post(this.$apiURI + "/Permissions/UpdatePermission", {
            id: this.itemEdit[0].id,
            name: this.name,
            lastName: this.lastName,
            date: this.date,
            idPermissionType: this.selectedItem
          })
          .then((response) => {
            if (response.data.isValid) {
              //alert('Ok');
              this.$emit('save');
            } else {
                alert('Error 1 ' + response.data.message);
              //Swal.fire({ title: "Error!", text: response.data.message, icon: "error", confirmButtonText: this.lng.action.ok, });
            }
          })
          .catch(function (error) {
            if(error.response.status == 401) {
              alert('Error 2 ' + error.response.statusText);
            //Swal.fire({ title: "Error!", text: error, icon: "error", confirmButtonText: error.response.statusText, });
            } else {
                alert('Error 3' + error);
            }
          });
      }
    },
    }
}
</script>
<style scoped>
/* #add-container{
    padding: 10px;
}
input{
    padding: 10px;
    margin-left: 20px;
    outline: none;
    border: solid 1px #ccc;
    width: 65%;
}
.select-css {
  display: block;
  font-size: 16px;
  font-family: 'Verdana', sans-serif;
  font-weight: 400;
  color: #444;
  line-height: 1.3;
  padding: .4em 1.4em .3em .8em;
  width: 65%;
  box-sizing: border-box;
 margin-left: 20px;
  border: 1px solid #aaa;
  box-shadow: 0 1px 0 1px rgba(0,0,0,.03);
  border-radius: .3em;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
    linear-gradient(to bottom, #ffffff 0%,#f7f7f7 100%);
  background-repeat: no-repeat, repeat;
  background-position: right .7em top 50%, 0 0;
  background-size: .65em auto, 100%;
}
.select-css::-ms-expand {
  display: none;
}
.select-css:hover {
  border-color: #888;
}
.select-css:focus {
  border-color: #aaa;
  box-shadow: 0 0 1px 3px rgba(59, 153, 252, .7);
  box-shadow: 0 0 0 3px -moz-mac-focusring;
  color: #222; 
  outline: none;
}
.select-css option {
  font-weight:normal;
} */
</style>