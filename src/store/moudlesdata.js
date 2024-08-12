import axios from "axios"
export default {
    namespaced: true,
    state:{
        categories: [],
        sub_categories: [],
        nested_sub_categories: [],
        product_disease:[],

    },
    getters:{
        categories: (state) => state.categories,
        sub_categories: (state) => state.sub_categories,
    },
    mutations:{
        setSubCategory(state, data) {
            state.sub_categories = data;
        },
        nestedSubCategories(state, data) {
            state.nested_sub_categories = data;
            

        },
        productDisease(state, data) {
            state.product_disease = data;
            

        },
        
    },
    actions:{
        
        async getSubCategories({commit}) {
            let subCategory = await axios.post(process.env.VUE_APP_BASE_URL+'/sub-category/all', {status:true});

            commit('setSubCategory',subCategory)
        },

        async getNestedSubCategories({commit}) {
            let data = await axios.post(process.env.VUE_APP_BASE_URL+'/nested-sub-category/all', {status:true});
            // let ndata = data.data.data.map(element => {
            //     let name= `${element.name} (${element.sub_category && element.sub_category.sub_category_name})`
            //     return {
            //         created_at: element.created_at,
            //         description: element.description,
            //         id: element.id,
            //         name:name,
            //         slug: element.slug,
            //         status: element.status,
            //         sub_category: element.sub_category,
            //         sub_category_id: element.sub_category_id,
            //         updated_at: element.updated_at,
            //     }
            // });
            commit('nestedSubCategories',data.data.data)
        },
        async getProductDisease({commit}) {
            let data = await axios.post(process.env.VUE_APP_BASE_URL+'/disease/all', {status:true});
            
            commit('productDisease',data.data.data)
        }
        
    }
}