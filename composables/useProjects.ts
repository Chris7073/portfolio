const projectsList = [
    { id:"1", text:"Premio scopino", desc:"Scopino del cesso award", hash:"#figma",bg:"/assets/bg.jpeg",img1:"/assets/bg.jpeg",img2:"/assets/bg.jpeg",links:[
        {social:"instagram",url:"instagram.com"},
        {social:"google",url:"google.com"},
        {social:"linkedin",url:"linkedin.com"},
    ],
        longdesc:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.<br> <b>Ut enim ad minim veniam</b>, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {id:"2", text:"test", desc:"test 2", bgCol:"bg-blue-500"},
    {id:"3", text:"test", desc:"test 2", bg:"/assets/bg.jpeg", bgCol:"bg-red-500"},
    {id:"4", text:"test", desc:"test 2", bgCol:"bg-yellow-500"},
    {id:"5", text:"test", desc:"test 2", bgCol:"bg-blue-200"},
    {id:"6", text:"test", desc:"test 2", bgCol:"bg-orange-500"},
]; 

function getProject(id:string){
    return projectsList.find(proj => proj.id == id);
}

export function useProjects(){
    return {projectsList,getProject};
}
