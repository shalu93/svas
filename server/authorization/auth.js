import jwt from 'jsonwebtoken';

class Authorization {
    static authorization(req,res,next) {
        const token = req.headers.authorization;
        if (!token || token === ' ') {
            return res.status(400).json ({
                status : 400,
                message : 'you are not authorised to do the transaction please enter the token',
            });
        }
        // eslint-disable-next-line
        jwt.verify(token, process.env.JWTSECRETKEY, (err,decode) => {
            if(err) {
                res.status(400).json({
                    status: 400,
                    message : 'token is not valid',
                });
            
            } else {
                req.Info = decode;
                next();
            }
        });
    }
}
export default Authorization;