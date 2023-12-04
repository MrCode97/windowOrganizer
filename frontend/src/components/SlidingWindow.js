import React from 'react';



function SlidingWindow() {

    // window number, location hint text, address, apero flag, start_time, end_time fetched from backend
    let window_nr = 15;
    let location_hint = "Some location hint text from backend";
    let has_apero = true;
    let start_time = "18.00";
    let end_time = "20.00";
    let address = "some address";

    return <><div>Window {window_nr}</div><div>{address}</div><div>{start_time + " "}-{" " + end_time}</div></>
}