<template>
  <q-page class="q-pa-lg">
    <!-- Layout Page -->
    <div class="container">
      <div class="row">
        <div class="column">
          <h4>Reportes</h4>
        </div>
      </div>
      <div class="row">
        <div class="column">
          <q-select v-model="reportSelected" :options="reportOptions" label="Standard" />
          <q-date
            class="q-mt-xs"
            v-if="reportSelected === 'Segmentacion por Fechas'"
            v-model="filterDate"
            range
          />
          <q-btn
            :outline="isDarkModeActive"
            color="primary"
            class="create-button"
            icon="bookmarks"
            label="Generar Reporte"
            @click="generateReport(reportSelected)"
          />
        </div>
      </div>
      <h5 v-if="reportTitle" class="q-mb-xs">{{ reportTitle }}</h5>
      <div class="row">
        <div class="column custom-column">
          <div class="q-py-md user-table">
            <q-table
              title="Loans"
              :rows="rows"
              :columns="columns"
              row-key="id"
              :filter="filter"
              :rows-per-page-options="[10]"
            >
              <template v-slot:top>
                <q-btn
                  color="primary"
                  icon-right="archive"
                  label="Exportar a cvs"
                  no-caps
                  @click="exportTable"
                />
                <q-space />
                <q-input
                  outlined
                  dense
                  label="Filtrar"
                  debounce="300"
                  color="primary"
                  v-model="filter"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
                </q-tr>
              </template>"
            </q-table>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { exportFile, useQuasar } from "quasar";
import moment from "moment";
import { positiveMessage, negativeMessage } from "src/composable/light-notify";
import { columnsForLoans } from "src/composable/column-tables";

const columns = columnsForLoans;

// Wrap te report to CVS
function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

export default {
  setup() {
    // general variables
    const $store = useStore();
    const $q = useQuasar();

    // report options
    const reportOptions = ['Vencidos', 'Segmentacion por Fechas'];
    const currentDate = moment().subtract(1, "days").format("YYYY/MM/DD");
    const anotherDate = moment().add(12, 'days').format("YYYY/MM/DD")
    let recoveryReport = null;
    const reportSelected = ref(reportOptions[0]);
    const reportTitle = ref(null);
    const filterDate = ref({ from: currentDate, to: anotherDate })


    // Table variables
    const rows = ref([]);
    const filter = ref("");
    const isLoadingTable = ref(false);

    // Dialogs


    const isDarkModeActive = computed(() => $q.dark.isActive);

    // Get all data for the first render
    (async function setupReports() {
      isLoadingTable.value = true;
      try {
        await $store.dispatch('loansModule/readLoans');
        isLoadingTable.value = false;
        rows.value = generateFormatReport($store.state.loansModule.loans);
      } catch (e) {
        negativeMessage("Error", "Hubo un error al obtener los datos");
      }
    })();

    // This generates the format for our table report
    const generateFormatReport = (rows) => rows.map((row) => {
      if (row.fecha_prestamo) {
        return { ...row, fecha_prestamo: moment(row.fecha_prestamo).format('YYYY/MM/DD') }
      }
      return row;
    });

    // Events
    const generateReport = (reportSelected) => {
      recoveryReport = generateFormatReport($store.state.loansModule.loans);
      if (reportSelected === "Vencidos") {
        generateVencidos();
      } else if (reportSelected === "Segmentacion por Fechas") {
        generateByFecha();
      }
    }

    const generateVencidos = () => {
      reportTitle.value = "Libros Vencidos";
      rows.value = recoveryReport.filter((row) => {
        const daysPassed = moment(row.fecha_prestamo).diff(moment().format(), 'days');
        const isExpired = (Number(row.dias_prestamo) + daysPassed) < 0
        const isNotReturned = row.estado === "En Prestamo";

        if (!row.fecha_prestamo) {
          return;
        }
        if (isExpired && isNotReturned) {
          return row;
        }
      })
    }

    const generateByFecha = () => {
      reportTitle.value = "Segmentacion por fecha"
      rows.value = recoveryReport.filter((row) => {
        if (!row.fecha_prestamo) return;
        const isFechaBetweenDates = moment(row.fecha_prestamo).isBetween(filterDate.value.from, filterDate.value.to);
        if (isFechaBetweenDates) {
          return row;
        }
      })
    }

    const exportTable = () => {
      // naive encoding to csv format
      const content = [columns.map(col => wrapCsvValue(col.label))].concat(
        rows.value.map(row => columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const nameFile = reportTitle.value ? reportTitle.value : "Reporte Prestamos";

      const status = exportFile(
        nameFile,
        content,
        'text/csv'
      )

      if (status !== true) {
        $q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    }

    // return Reactive data
    return {
      columns,
      rows,
      isDarkModeActive,
      filter,
      filterDate,
      reportOptions,
      reportSelected,
      reportTitle,
      exportTable,
      generateReport,
    }
  }
}
</script>


<style lang="scss" scoped>
@use "../css/table-pages.scss";
</style>
