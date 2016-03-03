console.log('Homework 2-A... via Skye')

d3.csv('../data/hubway_trips_reduced.csv',parse,dataLoaded);

function dataLoaded(err,rows){

    //console.log(rows);
    var allTrips = crossfilter(rows),
        tripsByTime = allTrips.dimension(function(d){return d.startTime}),
        tripsByGender = allTrips.dimension(function(d){return d.gender}),
        tripsByStation = allTrips.dimension(function(d){return d.startStation}),
        tripsByDuration = allTrips.dimension(function(d){return d.duration});

    // 1. log total number of trips in 2012
    var timeExtent = [new Date(2012,0,1),new Date(2013,0,1)];
    var tripsIn2012 = tripsByTime.filter(timeExtent).top(Infinity);
    console.log('1. Total number of Boston Hubway trips in 2012 = ' + tripsIn2012.length)

    // 2. log total number of trips in 2012 AND taken by male, registered users
    var tripsByMales2012 = tripsByGender.filter('Male').top(Infinity);
    console.log('2. Total number of Boston Hubway trips by males in 2012 = ' + tripsByMales2012.length)


    // 3. log total number of trips in 2012, by all users (male, female, or unknown), starting from Northeastern (station id 5).
    tripsByGender.filter(null);
    var trips2012fromNE = tripsByStation.filter('5').top(Infinity);
    console.log('3. Total number of Boston Hubway trips in 2012 starting at Northeastern = ' + trips2012fromNE.length)


    // 4. log the array of the top 50 trips, in all time, by all users, regardless of starting point, in terms of trip duration.
    //var tripsByAge = allTrips.dimension(function(d){return d.userAge});
    tripsByTime.filter(null);
    tripsByStation.filter(null);
    var tripsByDuration_top50 = tripsByDuration.filter().top(50);
    console.log('4. Top 50 Boston Hubway trips by duration = ');
    console.log(tripsByDuration_top50);


    //Afterwards, clear all filters.
    tripsByDuration.filter(null);
    //console.log('--- Filters cleared; total trips = ' + tripsByTime.top(Infinity).length + ' ---');


    // 5. group and log all trips into 10-year age buckets
    //var tripsByAge = allTrips.dimension(function(d){return (d.startTime- d.birthDate)}); //why doesn't this work?
    var tripsByAge = allTrips.dimension(function(d){return d.age});
    var tripsGroupedByDecade = tripsByAge.group(function(d){return Math.floor(d/10)});

    console.log('5. All Boston Hubway trips logged into 10-year age groups:')
    console.log('# of decadal age groups = ' + tripsGroupedByDecade.all().length + ' (first group includes all trips with no age listed)');
    console.log(tripsGroupedByDecade.all());
    console.log('Hubway trips by users between ages 10 and 20 = ' + tripsGroupedByDecade.all()[7].value);
    console.log('Hubway trips by users between ages 20 and 30 = ' + tripsGroupedByDecade.all()[6].value);
    console.log('Hubway trips by users between ages 30 and 40 = ' + tripsGroupedByDecade.all()[5].value);
    console.log('Hubway trips by users between ages 40 and 50 = ' + tripsGroupedByDecade.all()[4].value);
    console.log('Hubway trips by users between ages 50 and 60 = ' + tripsGroupedByDecade.all()[3].value);
    console.log('Hubway trips by users between ages 60 and 70 = ' + tripsGroupedByDecade.all()[2].value);
    console.log('Hubway trips by users between ages 70 and 80 = ' + tripsGroupedByDecade.all()[1].value);
}

function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn,
        birthDate: +d.birth_date,
        age: (d.start_date, +d.birth_date),
        gender: d.gender
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

