async filter(userid, date) {

  try {
      let month = date;
      // console.log(month)
      let days = new Date(2022, month, 0).getDate()
      console.log(days)
      const start = new Date()
      start.setMonth(month - 1, 1);
      start.setUTCHours(0, 0, 0, 0)
      // start.setMonth(1);


      const end = new Date()
      end.setMonth(month - 1, days);
      end.setUTCHours(0, 0, 0, 0)

      // console.log(start);
      // console.log(end);

      const data = await this.model.aggregate([
          { $match: { date: { $gte: start, $lt: end } } },
          {
              $group: {
                  _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                  // title: { $first: '$title' },
                  price: { $first: '$price' },
                  status: { $first: '$status' },
              },
          },
      ]);
      // console.log(data)
      var arrDays = [];
      var arrPrice = [];
      for (let price of data) {
          arrDays.push(price._id);
          arrPrice.push(price.price);
      }
      //console.log(arrDays);
      //console.log(arrPrice);
      let arr = [];
      if (month < 10) {
          month = `0${month}`
      }
      var dayWiseData = [];
      for (let i = 0; i < days; i++) {
          var day = i + 1;
          if (day < 10) {
              day = `0${day}`
          }
          var strDate = `2022-${month}-${day}`
          //console.log(String(strDate))
          //console.log(arrDays.indexOf(strDate));
          if (arrDays.indexOf(strDate) > -1) {
              var index = arrDays.indexOf(strDate);
              var dayPrice = arrPrice[index]
              dayWiseData.push(dayPrice);
          } else {
              dayWiseData.push(0);
          }

          // data.push(obj)


          // console.log(obj)
          // }



      }
      console.log(dayWiseData);


      // for (let i = 1; i < days + 1; i++) {
      //     let test = new Date();
      //     test.setMonth(month - 1, i);
      //     // console.log(test);
      //     let obj = {
      //         _id: test.toLocaleDateString("fr-CA"),
      //         price: 0,
      //         status: "---"

      //     }
      //     data.push(obj);
      // }

// for (let i = 1; i < days + 1; i++) {
            //     let test = new Date();
            //     test.setMonth(month - 1, i);
            //     // console.log(test);
            //     let obj = {
            //         _id: test.toLocaleDateString("fr-CA"),
            //         amount: 0,
            //         type: "---"

            //     }
            //     // console.log(obj)
            //     // }
            //     data.push(obj)
            //     // data.sort();
            //     // console.log(Array)

            // }
            // for (let m = 0; m < data; m++) {
            //     console.log(m)
            //     // console.log(data[m]._id , arr[m]._id)
            //     if (data[m]._id !== arr[m]._id) {

            //         // data.push(obj);
            //         arr[m].replace(data[m]);
            //     } else {

            //     }
            // }

            // arr[1].price.replace(data[1].price);
            // console.log(data[1].price)
            // data.push(obj)
            // console.log(arr)
            // console.log(arr.length)

            // for (let j = 0; j < arr.length; j++) {
            //     // const element = arr[j]._id;
            //     for (let k = 0; k < data.length; k++) {
            //         // const element = array[k];

            //         if (!data._id == arr[j]._id) {
            //             data.push(arr[j])
            //             // console.log(arr[j])
            //         } else {

            //         }
            //     }
            //     // console.log('first')

            // console.log(element);

            // }
            // console.log(data);



      return {
          error: false,
          statusCode: 200,
          data,
          // arr,
      };


  } catch (error) {
      console.log(error);
      return {
          error: true,
          statusCode: 500,
          message: 'Not User Found',
          errors: error,
      };
  }
}