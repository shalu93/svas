import jwt from 'jsonwebtoken';

class Authorization {
    static authorization(req,res,next) {
        const token = req.headers.authorization;
        if (!token || token === ' ') {
            return res.status(400).json ({
                status : 400,
                message : 'You are not authorized to do the transaction please enter the Authorization token',
            });
        }
        // eslint-disable-next-line
        jwt.verify(token, process.env.JWTSECRETKEY, (err,decode) => {
            if(err) {
                res.status(400).json({
                    status: 400,
                    message : 'The entered token is not valid , Please enter the correct Authorization token',
                });
            
            } else {
                req.Info = decode;
                next();
            }
        });
    }
}
export default Authorization;