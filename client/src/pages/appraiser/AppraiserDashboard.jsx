import { useContext} from 'react'
import { UserContext } from '../../context/userContext'
export default function AppraiserDashboard() {

    const {user} = useContext(UserContext)
    return (
        <div>
            <h1>Dashboard</h1>
            {!!user && <h2>Hello {user.role}</h2>}
        </div>
    )
}