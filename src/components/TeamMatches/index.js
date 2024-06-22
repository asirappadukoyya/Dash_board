import React, {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import {Link, useParams} from 'react-router-dom'

import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'
import PieChart from '../PieChart'

import './index.css'

const teamMatchesApiUrl = 'https://apis.ccbp.in/ipl/'

const getFormattedData = data => ({
  umpires: data.umpires,
  result: data.result,
  manOfTheMatch: data.man_of_the_match,
  id: data.id,
  date: data.date,
  venue: data.venue,
  competingTeam: data.competing_team,
  competingTeamLogo: data.competing_team_logo,
  firstInnings: data.first_innings,
  secondInnings: data.second_innings,
  matchStatus: data.match_status,
})

const TeamMatches = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [teamMatchesData, setTeamMatchesData] = useState({})
  const {id} = useParams()

  useEffect(() => {
    const getTeamMatches = async () => {
      const response = await fetch(`${teamMatchesApiUrl}${id}`)
      const fetchedData = await response.json()
      const formattedData = {
        teamBannerURL: fetchedData.team_banner_url,
        latestMatch: getFormattedData(fetchedData.latest_match_details),
        recentMatches: fetchedData.recent_matches.map(eachMatch =>
          getFormattedData(eachMatch),
        ),
      }
      setTeamMatchesData(formattedData)
      setIsLoading(false)
    }
    getTeamMatches()
  }, [id])

  const getNoOfMatches = value => {
    const {latestMatch, recentMatches} = teamMatchesData
    const currentMatch = value === latestMatch.matchStatus ? 1 : 0
    const result =
      recentMatches.filter(match => match.matchStatus === value).length +
      currentMatch
    return result
  }

  const generatePieChartData = () => [
    {name: 'Won', value: getNoOfMatches('Won')},
    {name: 'Lost', value: getNoOfMatches('Lost')},
    {name: 'Drawn', value: getNoOfMatches('Drawn')},
  ]

  const renderRecentMatchesList = () => {
    const {recentMatches} = teamMatchesData

    return (
      <ul className="recent-matches-list mb-0">
        {recentMatches.map(recentMatch => (
          <MatchCard matchDetails={recentMatch} key={recentMatch.id} />
        ))}
      </ul>
    )
  }

  const renderTeamMatches = () => {
    const {teamBannerURL, latestMatch} = teamMatchesData

    return (
      <div className={`responsive-container ${id}`}>
        <img src={teamBannerURL} alt="team banner" className="team-banner" />
        <LatestMatch latestMatchData={latestMatch} />
        <h1 className="latest-match-heading mt-3">Team Statistics</h1>
        <PieChart data={generatePieChartData()} />
        {renderRecentMatchesList()}
        <Link to="/">
          <button type="button" className="back-button">
            Back
          </button>
        </Link>
      </div>
    )
  }

  const renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height={50} />
    </div>
  )
  const className = `team-matches-container`

  return (
    <div className={className}>
      {isLoading ? renderLoader() : renderTeamMatches()}
    </div>
  )
}

export default TeamMatches
