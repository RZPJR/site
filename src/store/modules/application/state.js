const state = {
  applicationList: {
    isLoading: false,
    filter:{
      glossary: null,
    },
    table_headers: [
        {
            text: 'Application',
            class: 'grey--text text--darken-4',
            sortable: false
        },
        {
            text: 'Field',
            class: 'grey--text text--darken-4',
            sortable: false
        },
        {
            text: 'Attribute',
            class: 'grey--text text--darken-4',
            sortable: false
        },
        {
            text: 'Value',
            class: 'grey--text text--darken-4',
            sortable: false
        },
        {
            width: "5%",
            sortable: false
        },
    ],
    data: [],
  },

  updateApplication:{
    form:{
        value: '',
    },
  }
};

export default state;
