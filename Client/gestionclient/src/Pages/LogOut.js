 function LogOut({ history }) {

      fetch('/auth/logout')
      .then(res => {
        history.push('/auth/login')

            res.json()
        })
        .catch(err => console.log(err))
}

export default LogOut;