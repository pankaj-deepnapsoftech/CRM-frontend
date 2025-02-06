import Marquee from "react-fast-marquee";
import client1 from '../../../assets/clients/client1.png';
import client2 from '../../../assets/clients/client2.webp';
import client3 from '../../../assets/clients/client3.webp';
import client4 from '../../../assets/clients/client4.webp';
import client5 from '../../../assets/clients/client5.webp';
import client6 from '../../../assets/clients/client6.png';
import client7 from '../../../assets/clients/client7.png';
import client8 from '../../../assets/clients/client8.webp';
import client9 from '../../../assets/clients/client9.png';

const Clients = () => {
  return (
    <div className='mx-auto w-full my-20 px-2 md:px-10'>
        <h1 className='subscription-font text-center text-2xl md:text-4xl font-medium text-[#a7a7a7]'>We have 60+ active users across the nation</h1>
        <div className="mt-6 md:mt-16">
            <Marquee play>
                <img className="mx-6 h-[4rem] object-cover" src={client1}></img>
                <img className="mx-6 h-[4rem] object-cover" src={client2}></img>
                <img className="mx-6 h-[4rem] object-cover" src={client3}></img>
                <img className="mx-6 w-[8rem] object-cover" src={client4}></img>
                <img className="mx-6 h-[4rem] object-cover" src={client5}></img>
                <img className="mx-6 h-[4rem] object-cover" src={client6}></img>
                <img className="mx-6 h-[4rem] object-cover" src={client7}></img>
                <img className="mx-6 w-[8rem] object-cover" src={client8}></img>
                <img className="mx-6 h-[4rem] object-cover" src={client9}></img>
            </Marquee>
        </div>
    </div>
  )
}

export default Clients