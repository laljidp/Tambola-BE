
export const FKHelper = (model, id) => {
  return new Promise((resolve, reject) => {
    model.findOne({ _id: id }, (err, result) => {
      console.log('err', err)
      if (result) {
        return resolve(true)
      } else return reject(new Error(`FK Constraint 'checkObjectsExists' for '${id.toString()}' failed`))
    })
  })
}

export const ACTIVE_CONTEST_FIELD = [
  'name',
  'startDateTime',
  'joiningAmount',
  'prizes',
  'maxParticipants',
  'isFinished',
  'isPlaying'
]
