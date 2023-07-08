// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const Home = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Welcome To Pet Shop Admin 🚀'></CardHeader>
          <CardContent>
            {/* <Typography sx={{ mb: 2 }}>All the best for your new project.</Typography> */}
            <Typography>
              The admin page of our pet shop website provides comprehensive management tools for efficient operation. It allows administrators to add and update pet listings, manage customer orders, track inventory, and handle customer inquiries seamlessly. With an intuitive interface and robust functionalities, our admin page simplifies the day-to-day tasks of running a successful pet shop online.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        {/* <Card>
          <CardHeader title='ACL and JWT 🔒'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>
              Access Control (ACL) and Authentication (JWT) are the two main security features of our template and are implemented in the starter-kit as well.
            </Typography>
            <Typography>Please read our Authentication and ACL Documentations to get more out of them.</Typography>
          </CardContent>
        </Card> */}
      </Grid>
    </Grid>
  )
}

export default Home
