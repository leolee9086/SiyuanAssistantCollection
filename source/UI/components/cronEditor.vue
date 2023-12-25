<template>
    <div>
        <label for="cron-input">Cron Expression:</label>
        <div>
            <label>Seconds:</label>
            <input v-model="seconds" @input="updateValue" />
        </div>
        <div>
            <label>Minutes:</label>
            <input v-model="minutes" @input="updateValue" />
        </div>
        <div>
            <label>Hours:</label>
            <input v-model="hours" @input="updateValue" />
        </div>
        <div>
            <label>Day of Month:</label>
            <input v-model="dayOfMonth" @input="updateValue" />
        </div>
        <div>
            <label>Month:</label>
            <input v-model="month" @input="updateValue" />
        </div>
        <div>
            <label>Day of Week:</label>
            <input v-model="dayOfWeek" @input="updateValue" />
        </div>
        <div>
            <label>Year:</label>
            <input v-model="year" @input="updateValue" />
        </div>
        <div>
            <label>下次触发:</label>
        </div>
    </div>
</template>
  
<script>
import {CronJob} from '../../utils/timer/index.js'
export default {
    props: {
        modelValue: {
            type: String,
            default: '* * * * * * *'
        }
    },
    data() {
        const [seconds, minutes, hours, dayOfMonth, month, dayOfWeek, year] = this.modelValue.split(' ');
        return {
            seconds,
            minutes,
            hours,
            dayOfMonth,
            month,
            dayOfWeek,
            year,
            cronExpression: this.modelValue
        }
    },
    watch: {
        modelValue(newVal) {
            const [seconds, minutes, hours, dayOfMonth, month, dayOfWeek, year] = newVal.split(' ');
            this.seconds = seconds;
            this.minutes = minutes;
            this.hours = hours;
            this.dayOfMonth = dayOfMonth;
            this.month = month;
            this.dayOfWeek = dayOfWeek;
            this.year = year;
            this.cronExpression = newVal;
        }
    },
    methods: {
        updateValue() {
            this.cronExpression = `${this.seconds} ${this.minutes} ${this.hours} ${this.dayOfMonth} ${this.month} ${this.dayOfWeek} ${this.year}`;
            this.$emit('update:modelValue', this.cronExpression);
        }
    },
    computed: {
        nextTrigger() {
            try {
                const job = new CronJob(this.cronExpression);
                console.log(job.nextDate())
                const nextDate = job.nextDate();
                return nextDate.toString();
            } catch (e) {
                return 'Invalid cron expression',e;
            }
        }
    }
}
</script>