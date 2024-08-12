<template>
    <div>
        <Sidebar>
            <section class="head">
                <h1>Welcome test3</h1>
                <p class="smalltxt">Book and manage your events in minutes</p>

                <div class="amt container">
                    <div class="row">
                        <div class="col-md-9">
                            <div class="amtbg py-5 px-3">
                                <p class="text-light" style="font-family:'Poppins', sans-serif;">Wallet Balance</p>
                                <h3 class="balance">12,560,078.00</h3> <i class="bi bi-eye eye"></i>
                                <button class="btn fund">
                                    <span> Fund Wallet</span>
                                </button>
                            </div>
                            <div class="features">
                                <div class="row my-4">
                                    <div class="col-md-3">
                                        <div class="vuetify-card bootstrap-card">
                                            <div class="py-3">
                                                <img src="../../assets/add.png" class="img-fluid iconimg" alt="">
                                                <p class="icontxt">Add Employee</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="vuetify-card bootstrap-card">
                                            <div class="py-3">
                                                <img src="../../assets/wallet.png" class="img-fluid iconimg" alt="">
                                                <p class="icontxt">Pay Salaries</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="vuetify-card bootstrap-card">
                                            <div class="py-3">
                                                <img src="../../assets/pay.png" class="img-fluid iconimg" alt="">
                                                <p class="icontxt">Pay compliamces</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="vuetify-card bootstrap-card">
                                            <div class="py-3">
                                                <img src="../../assets/loan.png" class="img-fluid iconimg" alt="">
                                                <p class="icontxt">Quick Loan</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card overall">
                                <div class="card-title heading">
                                    <p class="s">Next Payroll</p>
                                </div>
                                <div class="card-body side">
                                    <div class="cent">
                                        <span class="ic"><i class="bi bi-calendar-date"></i> Friday</span>
                                        <p class="pt-2 dates">09/11/2022</p>
                                    </div>
                                </div>
                                <h5 style="border-bottom: 1px solid #E7E8E7; width: 188px;"></h5>
                                <div class="omo px-2">
                                    <h2 class="tots">Total Employee</h2>
                                    <h1>64</h1>
                                    <div class="colored-line"></div>
                                    <p class="gender">Male <br> 32 </p>
                                    <p class="gender" style="float: right;">Female <br> 32</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="chart">
                <div class="card">
                    <div class="card-body py-5">
                        <div class="row">
                            <div class="col-4">
                                <small class="intxt">Inflow</small>
                                <h1 class="in">N1,562,552</h1>
                            </div>
                            <div class="col-4">
                                <small class="outtxt">Outflow</small>
                                <h1 class="out">N1,562,552</h1>
                            </div>
                            <div class="col-4" style="float: right;">
                                <small>Inflow/Outflow <i class="bi bi-chevron-compact-down"></i></small>
                            </div>
                        </div>
                        <div id="reportsChart" class="container"></div>
                        <button class="btn date">2022</button>
                    </div>
                </div>
            </section>
            <section class="activities my-4">
                <h2>Recent Activities</h2>
                <form class="search-wrapper cf">
                    <input type="text" placeholder="Search employee." required>
                    <button type="submit"><i class="bi bi-search"></i></button>
                </form>
                <button class="btn filter ml-3 mt-1">
                    <small> <i class="bi bi-sliders2-vertical"></i> filter</small>
                </button>
                <div class="row">
                    <div class="col-md-12">
                        <div class="card mt-4 staff">
                            <div class="card-body">
                                <div class="wed pt-4">
                                    <h5>Wednesday, November 09, 2022</h5>
                                    <div class="card radius">
                                        <div class="card-body px-3">
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <thead>
                                                        <tr>
                                                            <td class="emphead">Payroll</td>
                                                            <td class="emphead">Activity</td>
                                                            <td class="emphead">Employee</td>
                                                            <td class="emphead">Time</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr class="all">
                                                            <td>
                                                                <span class="d-flex pt-2">
                                                                    <span>
                                                                        <span class="b-avatar rounded-circle badge-success"
                                                                            style="width: 38px; height: 38px; font-weight: 600">
                                                                            BM
                                                                        </span>
                                                                    </span>
                                                                    <span class="ml-3">
                                                                        <span class="fw-semi-bold">&nbsp; Badmus Kemis</span>
                                                                    </span>
                                                                </span>
                                                            </td>
                                                            <td class="pt-3">Paid November 2022 salary</td>
                                                            <td class="pt-3">52</td>
                                                            <td class="pt-3">16:15</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="wed">
                                    <div class="card radius">
                                        <div class="card-body px-3">
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <thead>
                                                        <tr>
                                                            <td class="emphead">Payroll</td>
                                                            <td class="emphead">Activity</td>
                                                            <td class="emphead">Employee</td>
                                                            <td class="emphead">Time</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr class="all">
                                                            <td>
                                                                <span class="d-flex pt-2">
                                                                    <span>
                                                                        <span class="b-avatar rounded-circle badge-success"
                                                                            style="width: 38px; height: 38px; font-weight: 600">
                                                                            BM
                                                                        </span>
                                                                    </span>
                                                                    <span class="ml-3">
                                                                        <span class="fw-semi-bold">&nbsp; Badmus Kemis</span>
                                                                    </span>
                                                                </span>
                                                            </td>
                                                            <td class="pt-3">Paid November 2022 salary</td>
                                                            <td class="pt-3">52</td>
                                                            <td class="pt-3">16:15</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card-body">
                                <div class="wed pt-4">
                                    <h5>Friday, November 04, 2022</h5>
                                    <div class="card radius">
                                        <div class="card-body px-3">
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <thead>
                                                        <tr>
                                                            <td class="emphead">Bonus</td>
                                                            <td class="emphead">Activity</td>
                                                            <td class="emphead">Bonus Name</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr class="all">
                                                            <td>
                                                                <span class="d-flex pt-2">
                                                                    <span>
                                                                        <span class="b-avatar rounded-circle badge-success"
                                                                            style="width: 38px; height: 38px; font-weight: 600">
                                                                            BM
                                                                        </span>
                                                                    </span>
                                                                    <span class="ml-3">
                                                                        <span class="fw-semi-bold">&nbsp; Badmus Kemis</span>
                                                                    </span>
                                                                </span>
                                                            </td>
                                                            <td class="pt-3">Added new bonus</td>
                                                            <td class="pt-3">52</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="wed">
                                    <div class="card radius">
                                        <div class="card-body px-3">
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <thead>
                                                        <tr>
                                                            <td class="emphead">Bonus</td>
                                                            <td class="emphead">Activity</td>
                                                            <td class="emphead">Bonus Name</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr class="all">
                                                            <td>
                                                                <span class="d-flex pt-2">
                                                                    <span>
                                                                        <span class="b-avatar rounded-circle badge-success"
                                                                            style="width: 38px; height: 38px; font-weight: 600">
                                                                            BM
                                                                        </span>
                                                                    </span>
                                                                    <span class="ml-3">
                                                                        <span class="fw-semi-bold">&nbsp; Badmus Kemis</span>
                                                                    </span>
                                                                </span>
                                                            </td>
                                                            <td class="pt-3">Added new bonus</td>
                                                            <td class="pt-3">52</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="wed pt-4">
                                    <h5>Wednesday, November 02, 2022</h5>
                                    <div class="card radius">
                                        <div class="card-body px-3">
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <thead>
                                                        <tr>
                                                            <td class="emphead">Payroll</td>
                                                            <td class="emphead">Activity</td>
                                                            <td class="emphead">Employee</td>
                                                            <td class="emphead">Time</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr class="all">
                                                            <td>
                                                                <span class="d-flex pt-2">
                                                                    <span>
                                                                        <span class="b-avatar rounded-circle badge-success"
                                                                            style="width: 38px; height: 38px; font-weight: 600">
                                                                            BM
                                                                        </span>
                                                                    </span>
                                                                    <span class="ml-3">
                                                                        <span class="fw-semi-bold">&nbsp; Badmus Kemis</span>
                                                                    </span>
                                                                </span>
                                                            </td>
                                                            <td class="pt-3">Paid November 2022 salary</td>
                                                            <td class="pt-3">52</td>
                                                            <td class="pt-3">16:15</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Sidebar>
    </div>
</template>

<!-- <script>
export default {
    name: 'DashBoard',
    mounted() {
        // Initialize your charts here, e.g., ApexCharts
    }
}
</script> -->

<style scoped>
.gender{
    color:  #8D8E8D;
    font-family: 'Poppins';
    font-size: 10px;
    font-style: normal;
    font-weight: 700;
    /* line-height: 12px;  */
    display: inline-block;
}
/* .gender1{
    color:  #8D8E8D;
    font-family: 'Poppins';
    font-size: 10px;
    font-style: normal;
    font-weight: 700;
    float: right;
     line-height: 12px;
} */
.cent{
    align-items: center !important;
    text-align: center !important;
}
.tots{
    color: #515251;
    font-family: Aeonik;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; 
    text-align: left  !important;
}
  .colored-line {
    width: 95%;
    height: 10px;
    background: linear-gradient(to right, #11453B 50%, #EA4E4B 50%);
    margin-top: 30px;
    margin-bottom: 10px;
  }
.dates{
    color: #515251;
    font-family: 'Poppins';
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
}
.ic{
    color: var(--new-styles-text-body-dark, #515251);
    font-family: 'Poppins';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; 
}
.ic i {
    font-size: 14px;
}
.overall{
    width: 200px;
    /* padding: 0px 16px 16px 16px; */
    flex-direction: column;
    justify-content: space-between;
    align-self: stretch;
    border-radius: 24px;
    border: 1px solid var(--new-styles-grays-outline, #E7E8E7);
    background: var(--new-styles-shades-white, #FFF);

    /* Elevations/Light Mode/Light 2 */
    box-shadow: 0px 6px 12px 0px rgba(170, 170, 170, 0.11);
}
.heading{
    /* border-radius: 16px 16px 0px 0px; */
    background: #D9EBCD;
    width: 200px;
    height: 50px;
    border-radius: 24px 24px 0px 0px;
    box-shadow: 0px 9px 18px 0px rgba(170, 170, 170, 0.15);
}
.s{
    text-align: center;
    font-size: 16px;
    padding-top: 0px;
}
.amount {
    color: #EA4E4B !important;
    font-family: 'Poppins';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    /* 150% */
}

.radius {
    border-radius: 16px !important;
}

.emphead {
    color: var(--new-styles-text-body-normal, #8D8E8D);
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    /* 133.333% */
}

.all td {
    color: var(--new-styles-text-body-dark, #515251);
    font-family: 'Poppins';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
}

.staff {
    border-radius: 20px;
    background: rgba(242, 241, 241, 0.50);
}

/*Clearing Floats*/
.cf:before,
.cf:after {
    content: "";
    display: table;
}

.cf:after {
    clear: both;
}

.cf {
    zoom: 1;
}

/* Form wrapper styling */

.search-wrapper {
    width: 90%;
    border-radius: 40px;
    border: 1px solid #B5B6B5;
    background: #fff;
    display: inline-block;
}

/* Form text input */

.search-wrapper input {
    padding-left: 20px;
    width: 330px;
    height: 20px;
    font: bold 13px 'lucida sans', 'trebuchet MS', 'Tahoma';
    border: 0;
    background: transparent;
    border-radius: 40px;
    border-top-style: none;
}

.search-wrapper input:focus {
    outline: 0;
    background: #fff;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.8) inset;
}

.search-wrapper ::placeholder {
    color: #999;
    font-weight: normal;
    padding-left: 20px;
    padding-top: 20px;
}

/* Form submit button */
.search-wrapper button {
    overflow: visible;
    position: relative;
    float: right;
    border: 0;
    padding: 0;
    cursor: pointer;
    height: 40px;
    width: 110px;
    font: 13px/40px 'lucida sans', 'trebuchet MS', 'Tahoma';
    color: #11453B;
    text-transform: uppercase;
    background: #D9EBCD;
    border-radius: 0px 40px 40px 0px;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, .3);
}

.search-wrapper button:hover {
    /*     background: #e54040; */
}

.search-wrapper button:active,
.search-wrapper button:focus {
    background: #198cff;
    outline: 0;
}

.search-wrapper button:focus:before,
.search-wrapper button:active:before {
    border-right-color: #c42f2f;
}

.search-wrapper button::-moz-focus-inner {
    /* remove extra button spacing for Mozilla Firefox */
    border: 0;
    padding: 0;
}

.date {
    width: 80px;
    padding: 10px 16px;
    background: #11453B;
    float: right;
    color: white;
    border-radius: 0px;
}

.smalltxt {
    font-size: 16px;
    color: #515251;
}

.amtbg {
    /* background-image: url('../../assets/amtbg.png'); */
    background: #1e5144;
    border-radius: 20px;

}

.balance {
    color: white;
    display: inline;
}

.eye {
    color: white;
    font-size: 20px;
    padding-left: 10px;
}

.fund {
    background: #d8ebcc;
    color: #1e5144;
    border-radius: 50px;
    float: right;
    width: 150px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.fund span {
    font-size: 14px;
}

.fund:hover {
    background: #d8ebcc;
    color: #1e5144;
    border-radius: 50px;
    float: right;
    width: 150px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.vuetify-card {
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s;
    margin-top: 20px;
    margin-bottom: 50px;
}

.bootstrap-card {
    border: none;
}

.iconimg {
    display: block;
    margin-left: auto;
    margin-right: auto;
    /* width: 50%; */
}

.icontxt {
    font-size: 14px;
    color: #515251;
    text-align: center;
    padding-top: 10px;
}

.in {
    color: #219653;
    font-family: 'Poppins';
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: 36px;
}

.out {
    color: #EF4444;
    font-family: 'Poppins';
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: 36px;
}

.filter {
    border-radius: 16px;
    border: 1px solid #B5B6B5;
    background: #FFF;
    color: #8D8E8D;
}

.filter:hover {
    border-radius: 16px;
    border: 1px solid #B5B6B5;
    background: #FFF;
    color: #8D8E8D;
}
@media screen and (max-width: 768px) {
    .in{
        font-size: 15px;
    }
    .out{
        font-size: 15px;
    }
    .search-wrapper input{
        width: auto;
    }
    .overall{
        width: 100%;
    }
    .heading{
        width: 100%;
    }
}

@media screen and (max-width: 1200px) {
    .balance {
        font-size: 24px;
    }
    .fund {
        width: 120px;
    }
    .amtbg {
        padding: 20px;
    }
}

@media screen and (max-width: 992px) {
    .balance {
        font-size: 20px;
    }
    .amtbg {
        padding: 16px;
    }
    .in, .out {
        font-size: 20px;
    }
    .cent {
        text-align: left !important;
    }
    .dates {
        font-size: 16px;
    }
    .overall, .heading {
        width: 100%;
    }
}

@media screen and (max-width: 768px) {
    .amtbg {
        padding: 10px;
        border-radius: 15px;
    }
    .vuetify-card {
        margin-bottom: 30px;
    }
    .features .row {
        flex-direction: column;
    }
    .bootstrap-card {
        margin-bottom: 20px;
    }
    .chart .card-body {
        padding: 20px 10px;
    }
    .in, .out {
        font-size: 16px;
    }
    .balance {
        font-size: 18px;
    }
    .overall {
        margin-top: 20px;
        margin-bottom: 20px;
    }
}

@media screen and (max-width: 576px) {
    .amtbg {
        padding: 8px;
        border-radius: 10px;
    }
    .fund {
        width: 100px;
        font-size: 12px;
    }
    .balance {
        font-size: 16px;
    }
    .chart .card-body {
        padding: 15px 5px;
    }
    .overall, .heading {
        width: 100%;
    }
    .overall {
        margin-bottom: 15px;
    }
    .dates {
        font-size: 14px;
    }
    .tots {
        font-size: 14px;
    }
    .staff {
        margin-top: 10px;
    }
    .staff .card-body {
        padding: 10px 5px;
    }
}
</style>
<script>
import Sidebar from './partials/Sidebar.vue';
import VueApexCharts from 'vue3-apexcharts';

export default {
    name: "DashBoard",
  components: {
    ApexChart: VueApexCharts,
    Sidebar
  },
  data() {
    return {
      showFilter: false,
    };
  },
  methods: {
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
  },
  mounted() {
    const chart = new ApexCharts(document.querySelector("#reportsChart"), {
      series: [
        {
          name: 'Sales',
          data: [31, 40, 28, 51, 42, 82, 56, 31, 50, 18, 41, 92, 32],
        },
        {
          name: 'Revenue',
          data: [11, 32, 45, 32, 34, 52, 41, 31, 40, 28, 51, 42, 82],
        },
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        },
      },
      markers: {
        size: 4,
      },
      colors: ['#4154f1', '#2eca6a', '#ff771d'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.4,
          stops: [0, 90, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        categories: [
          'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
          'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC',
        ],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    });
    chart.render();
  },
};
</script>