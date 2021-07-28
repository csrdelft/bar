<template>
  <el-descriptions :column="1" border>
    <el-descriptions-item label="Huidig saldo">
      {{ formatBedrag(persoon.saldo) }}
    </el-descriptions-item>
    <el-descriptions-item label="Totaal bestelling">
      {{ formatBedrag(totaal) }}
    </el-descriptions-item>
    <el-descriptions-item label="Nieuw saldo">
      {{ formatBedrag(persoon.saldo - totaal) }}
    </el-descriptions-item>
  </el-descriptions>
  <el-divider />
  <div>
    <span> Huidig saldo: </span>
    <span :style="{ float: 'right' }">
      {{ formatBedrag(persoon.saldo) }}
    </span>
  </div>
  <el-divider />
  <span>
    Totaal bestelling:
    <span :style="{ float: 'right' }">{{ formatBedrag(totaal) }}</span>
  </span>
  <el-divider />
  <span>
    Nieuw Saldo:
    <span :style="{ float: 'right' }">{{
      formatBedrag(persoon.saldo - totaal)
    }}</span>
  </span>
  <el-divider />
  <div>
    <el-button
      type="success"
      icon="el-icon-check"
      @click="plaatsBestelling"
      :loading="bestellingLaden"
    />
    <el-button
      type="danger"
      icon="el-icon-close"
      @click="annuleer"
      :disabled="bestellingLaden"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { formatBedrag } from '../../util';

export default defineComponent({
  name: 'BestellingSamenvatting',
  props: {
    bestellingLaden: Boolean,
    persoon: Object,
    totaal: Number,
    plaatsBestelling: Function,
    annuleer: Function,
  },
  methods: {
    formatBedrag,
  },
});
</script>

<style scoped>
</style>
