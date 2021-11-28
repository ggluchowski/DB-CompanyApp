// Odczytywanie z Bazy Danych przy wykorzystaniu Cursora - lepsza wydajnosc
db.collection('employees').find({ department: 'IT' }, (err, data) => {
  if (!err) {
    data.each((error, employee) => {
      console.log(employee);
    })
  }
});
// wykorzystanie tablicy - pokazuje wszystkie dane, mozna uzyc forEach, filter

// db.collection('employees').find({ department: 'IT' }).toArray((err, data) => {
//   if(!err) {
//     console.log(data)
//   }
// });

// Doadawanie danych do BD

db.collection('departments').insertOne({name: 'Management'}, (err) => {
  if(err) console.log('err');
});

// Modyfikacja elemnetow

db.collection('employees').updateOne({department: 'IT'}, {$set: {salary: 6000}}, (err) => {
  if(err) console.log('err');
});

// Usuwanie elementow

db.collection('departments').deleteOne({name: 'Managment'}, (err) => {
  if(err) console.log('err');
});

// Element losowy - generowanie losowego elementu z BD, size oznacza liczbę probki; potrzebne jest zwrocenie toArray, poniewaz obiekt ten zwraca zbior danych, a nie pojedynczy element

req.db.collection('departments').aggregate([{ $sample: { size: 1 } }]).toArray