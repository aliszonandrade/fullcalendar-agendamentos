var appointment = require("../models/Appointment");
var mongoose = require('mongoose');
var AppointmentFactory = require('../factories/AppointmentFactory');
const Appo = mongoose.model("Appointment", appointment);

class AppointmentService{
    async Create(name, email, cpf, description, date, time, finished){
        var newAppo = new Appo({
            name,
            email,
            cpf,
            description,
            date,
            time,
            finished: false,
            notified: false
        });

        try {
            await newAppo.save();    
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
        
    }

    async GetAll(showFinished){
        if(showFinished){
            return await Appo.find();
        }else{
            var appos = Appo.find({'finished': false});
            var appointments = [];

            (await appos).forEach(appointment => {
                if(appointment.date != undefined)
                    appointments.push(AppointmentFactory.Build(appointment));
            });

            return appointments;
        }
    }

    async GetById(id){
        try {
            var result = await Appo.findOne({'_id': id});
            return result;    
        } catch (error) {
            console.log(error);
        }        
    }

    async Finish(id){
        try {
            await Appo.findByIdAndUpdate(id, {finished: true});    
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }        
    }

    async Search(query){
        try {
            var appos = await Appo.find().or([{email: query},{cpf: query}]);
            return appos;
        } catch (error) {
            console.log(error);
            return [];
        }
        
    }

    async SendNotification(){
        var appos = await this.GetAll(false);
        appos.forEach(app => {
            var date = app.getTime();
            var hour = 1000 * 60 * 60;
            var gap = date-Date.now();
            
            if(gap <= hour){
                console.log(app.title)
                console.log("Mande a notification")
            }
        });
    }
}

module.exports = new AppointmentService();