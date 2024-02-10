// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const codes = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {
    cowinDashboardDetails: {},
    status: codes.initial,
  }

  componentDidMount() {
    this.renderCowinDetails()
  }

  renderCowinDetails = async () => {
    this.setState({status: codes.inProgress})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)

      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(eachVaccine => ({
          vaccineDate: eachVaccine.vaccine_date,
          dose1: eachVaccine.dose_1,
          dose2: eachVaccine.dose_2,
        })),
        vaccinationByAge: data.vaccination_by_age.map(eachAge => ({
          age: eachAge.age,
          count: eachAge.count,
        })),

        vaccinationByGender: data.vaccination_by_gender.map(eachGender => ({
          count: eachGender.count,
          gender: eachGender.gender,
        })),
      }
      console.log(updatedData)
      this.setState({cowinDashboardDetails: updatedData, status: codes.success})
    } else {
      this.setState({status: codes.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div>
      <h1>Something went wrong</h1>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
    </div>
  )

  renderCowinDashBoard = () => {
    const {cowinDashboardDetails} = this.state
    console.log(cowinDashboardDetails)
    return (
      <div>
        <VaccinationByCoverage
          coverageData={cowinDashboardDetails.last7DaysVaccination}
        />
        <VaccinationByGender
          genderDetails={cowinDashboardDetails.vaccinationByGender}
        />
        <VaccinationByAge ageDetails={cowinDashboardDetails.vaccinationByAge} />
      </div>
    )
  }

  renderCodes = () => {
    const {status} = this.state
    switch (status) {
      case codes.success:
        return this.renderCowinDashBoard()
      case codes.failure:
        return this.renderFailureView()
      case codes.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="cowin-dashboard-main-container">
        <div className="website-logo-name-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="website-logo"
          />
          <h1 className="cowin-heading">Co-WIN</h1>
        </div>
        <h1 className="cowin-vaccination-heading">
          CoWIN Vaccination in India
        </h1>
        {this.renderCodes()}
      </div>
    )
  }
}

export default CowinDashboard
