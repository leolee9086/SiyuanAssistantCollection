<template>
    <div>
        <div>
            <div>
                <span>
                    <label>秒:</label>
                    <input v-model="seconds" @input="updateValue" />
                </span>
                <span>
                    <label>分:</label>
                    <input v-model="minutes" @input="updateValue" />
                </span>
                <span>
                    <label>时:</label>
                    <input v-model="hours" @input="updateValue" />
                </span>
            </div>
            <div>
                <span>
                    <label>日:</label>
                    <input v-model="dayOfMonth" @input="updateValue" />
                </span>
                <span>
                    <label>月:</label>
                    <input v-model="month" @input="updateValue" />
                </span>
                <span>
                    <label>周:</label>
                    <input v-model="dayOfWeek" @input="updateValue" />
                </span>
            </div>
        </div>
        <span>
            <label>下次触发:</label>{{ nextTriggerTime }}
        </span>
    </div>
</template>
  
<script>
import { CronJob } from 'cronJob'
export default {
    props: {
        modelValue: {
            type: String,
            default: '* * * * * * *'
        }
    },
    data() {
        const [seconds, minutes, hours, dayOfMonth, month, dayOfWeek] = this.modelValue.split(' ');
        return {
            seconds,
            minutes,
            hours,
            dayOfMonth,
            month,
            dayOfWeek,
            cronExpression: this.modelValue,
            nextTriggerTime: '',
        }
    },
    mounted() {
        this.updateNextTriggerTime();
        setInterval(() => {
            this.updateNextTriggerTime();
        }, 500);
    },

    watch: {
        modelValue(newVal) {
            const [seconds, minutes, hours, dayOfMonth, month, dayOfWeek] = newVal.split(' ');
            this.seconds = seconds;
            this.minutes = minutes;
            this.hours = hours;
            this.dayOfMonth = dayOfMonth;
            this.month = month;
            this.dayOfWeek = dayOfWeek;
            this.cronExpression = newVal;
        }
    },
    methods: {
        updateValue() {
            this.cronExpression = `${this.seconds} ${this.minutes} ${this.hours} ${this.dayOfMonth} ${this.month} ${this.dayOfWeek} `;
            this.$emit('update:modelValue', this.cronExpression);
        },
        updateNextTriggerTime() {
            try {
                const job = new CronJob(this.cronExpression);
                const nextDateString = job.nextDate();
                const nextDate = new Date(nextDateString);
                const year = nextDate.getFullYear();
                const month = nextDate.getMonth() + 1;
                const date = nextDate.getDate();
                const hours = nextDate.getHours();
                const minutes = nextDate.getMinutes();
                const seconds = nextDate.getSeconds();
                this.nextTriggerTime = `${year}年${month}月${date}日 ${hours}时${minutes}分${seconds}秒`;
            } catch (e) {
                this.nextTriggerTime = 'Invalid cron expression';
            }
        },
    },

}
</script>
<style scoped>
input {
    width: 60px
}
</style>