import { LightningElement, track, wire } from 'lwc';
import getPeople from '@salesforce/apex/DevopsDashboardController.getPeople';
import getAllTasks from '@salesforce/apex/DevopsDashboardController.getAllTasks';

const SortArray = ['Urgent', 'High', 'Medium', 'Low'];

class Task {
    name;
    importance;
    style;
    urgency;
    constructor(rec) {
        this.name = rec.Name;
        this.importance = rec.Importance__c;
        this.style = `background-color: ${rec.Importance__c === 'Urgent' ? '#b83033' : rec.Importance__c === 'High' ? '#FF7900' : rec.Importance__c === 'Medium' ? '#FFFF00' : '#63B7B7'}`;
        this.urgency = rec.Importance__c === 'Urgent' ? '!' : '';
    }
}

class Person {
    name;
    inProgress;
    future;
    paused;
    constructor(rec) {
        this.name = rec.name;
        this.inProgress = rec.inProgress || [];
        this.future = rec.future || [];
        this.paused = rec.paused || [];
    }
    reset() {
        this.inProgress = [];
        this.future = [];
        this.paused = [];
    }
    sortAll() {
        this.inProgress.sort((a, b) => SortArray.indexOf(a.importance) - SortArray.indexOf(b.importance));
        this.future.sort((a, b) => SortArray.indexOf(a.importance) - SortArray.indexOf(b.importance));
        this.paused.sort((a, b) => SortArray.indexOf(a.importance) - SortArray.indexOf(b.importance));
    }
}

export default class DevopsDashboard extends LightningElement {
    @track people;

    @wire(getPeople) wiredPeople(response) {
        if (response.data) {
            this.people = response.data.map(person => new Person({ name: person }));
            this.updateNowSet();
            setInterval(() => this.updateNowSet(), 5000);
        }
    }

    updateNowSet = this.updateNow.bind(this);
    updateNow() {
        const people = this.people;
        getAllTasks({ random: (new Date).toLocaleString() }).then(response => {
            people.forEach(person => person.reset());
            response.forEach(item => {
                item.Assigned_To__c.split(';').forEach(element => {
                    people.find(Person => Person.name === element)[item.Status__c === 'In Progress' ? 'inProgress' : item.Status__c === 'Paused' ? 'paused' : 'future'].push(new Task(item));
                });
            });
            people.forEach(person => person.sortAll());
            this.people = people.map(person => new Person(person));
        });
    }

    get gridStyle() {
        return this.people ? `display: grid; gap: 25px; margin: 25px; grid-template-columns: repeat(${this.people.length}, minmax(0, 1fr));` : undefined;
    }

}