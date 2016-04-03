function create_CMS_Signed(buffer)
        {
            // #region Initial variables 
            var sequence = Promise.resolve();
            var current_files = $('#chatText').val();
            
            var cert_simpl = new org.pkijs.simpl.CERT();
            var cms_signed_simpl;

            var publicKey;
            var privateKey;

            var hash_algorithm;
            console.log("269");
            var hash_option = document.getElementById("hash_alg").value;
            switch(hash_option)
            {
                case "alg_SHA1":
                    hash_algorithm = "sha-1";
                    break;
                case "alg_SHA256":
                    hash_algorithm = "sha-256";
                    break;
                case "alg_SHA384":
                    hash_algorithm = "sha-384";
                    break;
                case "alg_SHA512":
                    hash_algorithm = "sha-512";
                    break;
                default:;
            }

            var signature_algorithm_name;
            var sign_option = document.getElementById("sign_alg").value;
            switch(sign_option)
            {
                case "alg_RSA15":
                    signature_algorithm_name = "RSASSA-PKCS1-V1_5";
                    break;
                case "alg_RSA2":
                    signature_algorithm_name = "RSA-PSS";
                    break;
                case "alg_ECDSA":
                    signature_algorithm_name = "ECDSA";
                    break;
                default:;
            }
            // #endregion 

            // #region Get a "crypto" extension 
            var crypto = org.pkijs.getCrypto();
            if(typeof crypto == "undefined")
            {
                bootbox.alert("No WebCrypto extension found");
                return;
            }
            // #endregion 

            // #region Put a static values 
            cert_simpl.version = 2;
            cert_simpl.serialNumber = new org.pkijs.asn1.INTEGER({ value: 1 });
            cert_simpl.issuer.types_and_values.push(new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                type: "2.5.4.6", // Country name
                value: new org.pkijs.asn1.PRINTABLESTRING({ value: "RU" })
            }));
            cert_simpl.issuer.types_and_values.push(new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                type: "2.5.4.3", // Common name
                value: new org.pkijs.asn1.BMPSTRING({ value: "Test" })
            }));
            cert_simpl.subject.types_and_values.push(new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                type: "2.5.4.6", // Country name
                value: new org.pkijs.asn1.PRINTABLESTRING({ value: "RU" })
            }));
            cert_simpl.subject.types_and_values.push(new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                type: "2.5.4.3", // Common name
                value: new org.pkijs.asn1.BMPSTRING({ value: "Test" })
            }));

            cert_simpl.notBefore.value = new Date(2013, 01, 01);
            cert_simpl.notAfter.value = new Date(2016, 01, 01);

            cert_simpl.extensions = new Array(); // Extensions are not a part of certificate by default, it's an optional array

            // #region "BasicConstraints" extension
            //var basic_constr = new org.pkijs.simpl.x509.BasicConstraints({
            //    cA: true,
            //    pathLenConstraint: 3
            //});

            //cert_simpl.extensions.push(new org.pkijs.simpl.EXTENSION({
            //    extnID: "2.5.29.19",
            //    critical: false,
            //    extnValue: basic_constr.toSchema().toBER(false),
            //    parsedValue: basic_constr // Parsed value for well-known extensions
            //}));
            // #endregion 

            // #region "KeyUsage" extension 
            var bit_array = new ArrayBuffer(1);
            var bit_view = new Uint8Array(bit_array);

            bit_view[0] = bit_view[0] | 0x02; // Key usage "cRLSign" flag
            //bit_view[0] = bit_view[0] | 0x04; // Key usage "keyCertSign" flag

            var key_usage = new org.pkijs.asn1.BITSTRING({ value_hex: bit_array });

            cert_simpl.extensions.push(new org.pkijs.simpl.EXTENSION({
                extnID: "2.5.29.15",
                critical: false,
                extnValue: key_usage.toBER(false),
                parsedValue: key_usage // Parsed value for well-known extensions
            }));
            // #endregion 
            // #endregion 

            // #region Create a new key pair 
            sequence = sequence.then(
                function()
                {
                    // #region Get default algorithm parameters for key generation 
                    var algorithm = org.pkijs.getAlgorithmParameters(signature_algorithm_name, "generatekey");
                    if("hash" in algorithm.algorithm)
                        algorithm.algorithm.hash.name = hash_algorithm;
                    // #endregion 

                    return crypto.generateKey(algorithm.algorithm, true, algorithm.usages);
                }
                );
            // #endregion 

            // #region Store new key in an interim variables
            sequence = sequence.then(
                function(keyPair)
                {
                    publicKey = keyPair.publicKey;
                    privateKey = keyPair.privateKey;
                },
                function(error)
                {
                    bootbox.alert("Error during key generation: " + error);
                }
                );
            // #endregion 

            // #region Exporting public key into "subjectPublicKeyInfo" value of certificate 
            sequence = sequence.then(
                function()
                {
                    return cert_simpl.subjectPublicKeyInfo.importKey(publicKey);
                }
                );
            // #endregion 

            // #region Signing final certificate 
            sequence = sequence.then(
                function()
                {
                    return cert_simpl.sign(privateKey, hash_algorithm);
                },
                function(error)
                {
                    bootbox.alert("Error during exporting public key: " + error);
                }
                );
            // #endregion 

            // #region Encode and store certificate 
            sequence = sequence.then(
                function()
                {
                    var cert_simpl_encoded = cert_simpl.toSchema(true).toBER(false);

                    var cert_simpl_string = String.fromCharCode.apply(null, new Uint8Array(cert_simpl_encoded));

                    var result_string = "-----BEGIN CERTIFICATE-----\r\n";
                    result_string = result_string + formatPEM(window.btoa(cert_simpl_string));
                    result_string = result_string + "\r\n-----END CERTIFICATE-----\r\n";

                    document.getElementById("chatLineHolder").innerHTML = result_string;

                    bootbox.alert("Certificate created successfully!");
                     certificate(result_string);
                },
                function(error)
                {
                    bootbox.alert("Error during signing: " + error);
                }
                );
            // #endregion 
            function certificate(certificate)
            {
                var cert=certificate
                console.log(cert);
                return cert;
            }
            // #region Exporting private key 
            sequence = sequence.then(
                function()
                {
                    return crypto.exportKey("pkcs8", privateKey);
                }
                );
            // #endregion 

            // #region Store exported key on Web page 
            sequence = sequence.then(
                function(result)
                {
                    var private_key_string = String.fromCharCode.apply(null, new Uint8Array(result));

                    var result_string = document.getElementById("new_signed_data").innerHTML;

                    result_string = result_string + "\r\n-----BEGIN PRIVATE KEY-----\r\n";
                    result_string = result_string + formatPEM(window.btoa(private_key_string));
                    result_string = result_string + "\r\n-----END PRIVATE KEY-----\r\n";

                    document.getElementById("new_signed_data").innerHTML = result_string;

                    bootbox.alert("Private key exported successfully!");
                },
                function(error)
                {
                    bootbox.alert("Error during exporting of private key: " + error);
                }
                );
            // #endregion 

            if(document.getElementById("add_ext").checked)
            {
                // #region Create a message digest 
                sequence = sequence.then(
                    function()
                    {
                        return crypto.digest({ name: hash_algorithm }, new Uint8Array(buffer));
                    }
                    );
                // #endregion 

                // #region Combine all signed extensions 
                sequence = sequence.then(
                    function(result)
                    {
                        var signed_attr = new Array();

                        signed_attr.push(new org.pkijs.simpl.cms.Attribute({
                            attrType: "1.2.840.113549.1.9.3",
                            attrValues: [
                                new org.pkijs.asn1.OID({ value: "1.2.840.113549.1.7.1" })
                            ]
                        })); // contentType

                        signed_attr.push(new org.pkijs.simpl.cms.Attribute({
                            attrType: "1.2.840.113549.1.9.5",
                            attrValues: [
                                new org.pkijs.asn1.UTCTIME({ value_date: new Date() })
                            ]
                        })); // signingTime

                        signed_attr.push(new org.pkijs.simpl.cms.Attribute({
                            attrType: "1.2.840.113549.1.9.4",
                            attrValues: [
                                new org.pkijs.asn1.OCTETSTRING({ value_hex: result })
                            ]
                        })); // messageDigest

                        return signed_attr;
                    }
                    );
                // #endregion 
            }

            // #region Initialize CMS Signed Data structures and sign it
            sequence = sequence.then(
                function(result)
                {
                    cms_signed_simpl = new org.pkijs.simpl.CMS_SIGNED_DATA({
                        version: 1,
                        encapContentInfo: new org.pkijs.simpl.cms.EncapsulatedContentInfo({
                            eContentType: "1.2.840.113549.1.7.1" // "data" content type
                        }),
                        signerInfos: [
                            new org.pkijs.simpl.CMS_SIGNER_INFO({
                                version: 1,
                                sid: new org.pkijs.simpl.cms.IssuerAndSerialNumber({
                                    issuer: cert_simpl.issuer,
                                    serialNumber: cert_simpl.serialNumber
                                })
                            })
                        ],
                        certificates: [cert_simpl]
                    });

                    if(document.getElementById("add_ext").checked)
                    {
                        cms_signed_simpl.signerInfos[0].signedAttrs = new org.pkijs.simpl.cms.SignedUnsignedAttributes({
                            type: 0,
                            attributes: result
                        });
                    }

                    if(document.getElementById("detached_signature").checked == false)
                    {
                        var contentInfo = new org.pkijs.simpl.cms.EncapsulatedContentInfo({
                            eContent: new org.pkijs.asn1.OCTETSTRING({ value_hex: buffer })
                        });

                        cms_signed_simpl.encapContentInfo.eContent = contentInfo.eContent;

                        return cms_signed_simpl.sign(privateKey, 0, hash_algorithm);
                    }
                    else
                    {
                        return cms_signed_simpl.sign(privateKey, 0, hash_algorithm, buffer);
                    }
                }
                );
            // #endregion 

            sequence.then(
                function(result)
                {
                    var cms_signed_schema = cms_signed_simpl.toSchema(true);

                    var cms_content_simp = new org.pkijs.simpl.CMS_CONTENT_INFO({
                        contentType: "1.2.840.113549.1.7.2",
                        content: cms_signed_schema
                    });

                    var cms_signed_schema = cms_content_simp.toSchema(true);

                    // #region Make length of some elements in "indefinite form" 
                    cms_signed_schema.len_block.is_indefinite_form = true;

                    var block1 = cms_signed_schema.value_block.value[1];
                    block1.len_block.is_indefinite_form = true;

                    var block2 = block1.value_block.value[0];
                    block2.len_block.is_indefinite_form = true;

                    var block3;

                    if(document.getElementById("detached_signature").checked == false)
                    {
                        block3 = block2.value_block.value[2];
                        block3.len_block.is_indefinite_form = true;
                        block3.value_block.value[1].len_block.is_indefinite_form = true;
                        block3.value_block.value[1].value_block.value[0].len_block.is_indefinite_form = true;
                    }
                    // #endregion 

                    cmsSignedBuffer = cms_signed_schema.toBER(false);

                    // #region Convert ArrayBuffer to String 
                    var signed_data_string = "";
                    var view = new Uint8Array(cmsSignedBuffer);

                    for(var i = 0; i < view.length; i++)
                        signed_data_string = signed_data_string + String.fromCharCode(view[i]);
                    // #endregion 

                    var result_string = document.getElementById("new_signed_data").innerHTML;

                    result_string = result_string + "\r\n-----BEGIN CMS-----\r\n";
                    result_string = result_string + formatPEM(window.btoa(signed_data_string));
                    result_string = result_string + "\r\n-----END CMS-----\r\n\r\n";

                    document.getElementById("new_signed_data").innerHTML = result_string;

                    parse_CMS_Signed();

                   bootbox.alert("CMS Signed Data created successfully!");
                },
                function(error)
                {
                   bootbox.alert("Erorr during signing of CMS Signed Data: " + error);
                }
                );
            return;
        }